module ActivityForm exposing (Model, Msg(..), dateRequested, initEdit, initNew, selectDate, update, view)

import Activity exposing (Activity, Minutes)
import ActivityShape
import Api
import Date exposing (Date)
import Html exposing (Html, button, div, input, text)
import Html.Attributes exposing (class, id, name, placeholder, style, type_, value)
import Html.Events exposing (on, onClick, onInput)
import Json.Decode as Decode
import Task exposing (Task)



{- GOOD EXAMPLE:
   https://github.com/rtfeldman/elm-spa-example/blob/master/src/Page/Settings.elm
-}


type alias Model =
    { status : Status
    , error : Maybe Error
    }


type Status
    = Creating Form
    | Editing String Form


type alias Form =
    { date : Maybe Date
    , description : String
    , duration : Maybe Minutes
    , pace : Maybe Activity.Pace
    }


type alias ValidForm =
    { date : Date
    , description : String
    , duration : Minutes
    , pace : Activity.Pace
    }


type Msg
    = EditedDescription String
    | EditedDuration String
    | SelectedPace String
    | RequestDate
    | GotDate Date
    | ClickedSubmit
    | ClickedReset
    | ClickedDelete
    | GotSubmitResult (Result Error (List Activity))
    | GotDeleteResult (Result Error (List Activity))


type Error
    = ApiError
    | EmptyFieldError String


initNew : Model
initNew =
    Model (Creating (Form Nothing "" Nothing Nothing)) Nothing


initEdit : Activity -> Model
initEdit activity =
    let
        form =
            Form
                (Just activity.date)
                activity.description
                (Just activity.duration)
                (Just activity.pace)
    in
    Model (Editing activity.id form) Nothing


toForm : Model -> Form
toForm model =
    case model.status of
        Creating form ->
            form

        Editing _ form ->
            form


dateRequested : Model -> Bool
dateRequested model =
    case (toForm model).date of
        Just date ->
            False

        Nothing ->
            True


selectDate : Model -> Date -> Model
selectDate model date =
    update (GotDate date) model |> Tuple.first


validateFieldExists : Maybe a -> String -> Result Error a
validateFieldExists fieldM fieldName =
    case fieldM of
        Just field ->
            Ok field

        Nothing ->
            Err <| EmptyFieldError fieldName


validate : Form -> Result Error ValidForm
validate form =
    Result.map4
        ValidForm
        (validateFieldExists form.date "date")
        (validateFieldExists (Just form.description) "description")
        (validateFieldExists form.duration "duration")
        (validateFieldExists form.pace "pace")


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        EditedDescription desc ->
            updateForm (\form -> { form | description = desc }) model

        EditedDuration str ->
            let
                minutes =
                    String.toInt str
            in
            updateForm (\form -> { form | duration = minutes }) model

        SelectedPace str ->
            updateForm (\form -> { form | pace = Activity.pace.fromString str }) model

        RequestDate ->
            updateForm (\form -> { form | date = Nothing }) model

        GotDate date ->
            updateForm (\form -> { form | date = Just date }) model

        ClickedSubmit ->
            case validate (toForm model) of
                Ok { date, description, duration, pace } ->
                    let
                        activity id =
                            Activity id date description duration pace

                        apiTask =
                            case model.status of
                                Editing id form ->
                                    Api.saveActivity (activity id)

                                Creating form ->
                                    Api.createActivity activity
                    in
                    ( initNew, Task.attempt GotSubmitResult (apiTask |> Task.mapError (\_ -> ApiError)) )

                Err error ->
                    ( { model | error = Just error }, Cmd.none )

        ClickedReset ->
            ( initNew, Cmd.none )

        ClickedDelete ->
            case model.status of
                Editing id _ ->
                    ( initNew, Task.attempt GotDeleteResult (Api.deleteActivity id |> Task.mapError (\_ -> ApiError)) )

                _ ->
                    ( initNew, Cmd.none )

        GotSubmitResult result ->
            case result of
                Ok activities ->
                    ( model, Cmd.none )

                Err error ->
                    ( { model | error = Just error }, Cmd.none )

        GotDeleteResult result ->
            case result of
                Ok activities ->
                    ( model, Cmd.none )

                Err error ->
                    ( { model | error = Just error }, Cmd.none )


updateForm : (Form -> Form) -> Model -> ( Model, Cmd Msg )
updateForm transform model =
    case model.status of
        Creating form ->
            ( { model | status = Creating (transform form) }, Cmd.none )

        Editing id form ->
            ( { model | status = Editing id (transform form) }, Cmd.none )


view : Model -> Html Msg
view model =
    let
        { date, description, duration, pace } =
            toForm model
    in
    div [ id "activity", class "column", style "justify-content" "space-between" ]
        [ div [ class "row no-grow" ]
            [ div [ class "column" ]
                [ viewError model.error
                , selectDateButton date
                ]
            ]
        , div [ class "row no-grow" ]
            [ div [ class "column center", style "flex-grow" "1" ]
                [ viewBlock pace duration ]
            , div [ class "column center", style "flex-grow" "3" ]
                [ input
                    [ type_ "text"
                    , placeholder "Description"
                    , onInput EditedDescription
                    , name "description"
                    , value description
                    ]
                    []
                ]
            ]
        , div [ class "row no-grow" ]
            [ div [ class "column" ]
                [ input
                    [ type_ "number"
                    , placeholder "Duration"
                    , onInput EditedDuration
                    , name "duration"
                    , value (duration |> Maybe.map String.fromInt |> Maybe.withDefault "")
                    ]
                    []
                , selectPace pace
                , submitButton model.status
                , button
                    [ onClick ClickedReset
                    , type_ "reset"
                    ]
                    [ text "Reset" ]

                --TODO: , deleteButton model.status
                ]
            ]
        ]


submitButton : Status -> Html Msg
submitButton status =
    case status of
        Editing id _ ->
            button
                [ onClick ClickedSubmit
                , type_ "submit"
                ]
                [ text "Save" ]

        Creating _ ->
            button
                [ onClick ClickedSubmit
                , type_ "submit"
                ]
                [ text "Create" ]


deleteButton : Status -> Html Msg
deleteButton status =
    case status of
        Editing id _ ->
            button
                [ onClick ClickedDelete
                , name "delete"
                ]
                [ text "Delete" ]

        Creating _ ->
            div [] []


selectDateButton : Maybe Date -> Html Msg
selectDateButton dateM =
    let
        content =
            case dateM of
                Just date ->
                    Date.toIsoString date

                Nothing ->
                    "Select Date"
    in
    button [ name "date", onClick RequestDate ] [ text content ]


selectPace : Maybe Activity.Pace -> Html Msg
selectPace paceM =
    Html.select
        [ onInput SelectedPace
        , name "pace"
        , value (paceM |> Maybe.map Activity.pace.toString |> Maybe.withDefault "Pace")
        ]
        (Html.option [] [ Html.text "Pace" ]
            :: List.map
                (\( paceStr, pace ) ->
                    Html.option [] [ Html.text paceStr ]
                )
                Activity.pace.list
        )


viewError : Maybe Error -> Html Msg
viewError errorM =
    case errorM of
        Just error ->
            div [ class "error" ] [ text <| errorMessage error ]

        Nothing ->
            div [ class "error" ] []


viewBlock : Maybe Activity.Pace -> Maybe Activity.Minutes -> Html msg
viewBlock paceM durationM =
    ActivityShape.init paceM durationM |> ActivityShape.view


errorMessage : Error -> String
errorMessage error =
    case error of
        EmptyFieldError field ->
            "Please fill in " ++ field ++ " field"

        _ ->
            "There has been an error"

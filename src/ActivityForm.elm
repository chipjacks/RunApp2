module ActivityForm exposing (Model, Msg(..), dateRequested, initEdit, initNew, selectDate, update, view)

import Activity exposing (Activity, Details(..), Interval(..), Minutes)
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
    , result : Result Error Activity
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
    Model (Creating (Form Nothing "" Nothing Nothing)) (Err (EmptyFieldError ""))


initEdit : Activity -> Model
initEdit activity =
    let
        form =
            case activity.details of
                Activity.Run (Activity.Interval minutes pace) ->
                    Form (Just activity.date) activity.description (Just minutes) (Just pace)

                Activity.Other minutes ->
                    Form (Just activity.date) activity.description (Just minutes) Nothing

                _ ->
                    Form (Just activity.date) activity.description Nothing Nothing
    in
    Model (Editing activity.id form) (Ok activity)


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


validate : Form -> Result Error Activity
validate form =
    Result.map4
        (\date description duration pace ->
            Activity "" date description <| Run (Interval duration pace)
        )
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
            case model.result of
                Ok activity ->
                    let
                        apiTask =
                            case model.status of
                                Editing id form ->
                                    Api.saveActivity { activity | id = id }

                                Creating form ->
                                    Api.createActivity (\id -> { activity | id = id })
                    in
                    ( initNew, Task.attempt GotSubmitResult (apiTask |> Task.mapError (\_ -> ApiError)) )

                Err error ->
                    ( { model | result = Err error }, Cmd.none )

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
                    ( { model | result = Err error }, Cmd.none )

        GotDeleteResult result ->
            case result of
                Ok activities ->
                    ( model, Cmd.none )

                Err error ->
                    ( { model | result = Err error }, Cmd.none )


updateForm : (Form -> Form) -> Model -> ( Model, Cmd Msg )
updateForm transform model =
    case model.status of
        Creating form ->
            ( { model | status = Creating (transform form), result = validate (transform form) }, Cmd.none )

        Editing id form ->
            ( { model | status = Editing id (transform form), result = validate (transform form) }, Cmd.none )


view : Model -> Html Msg
view model =
    let
        { date, description, duration, pace } =
            toForm model
    in
    div [ id "activity", class "column", style "justify-content" "space-between" ]
        [ div [ class "row no-grow" ]
            [ div [ class "column" ]
                [ selectDateButton date
                , viewError model.result
                ]
            ]
        , div [ class "row no-grow" ]
            [ div [ class "column center", style "flex-grow" "1" ]
                [ viewActivityShape model.result
                ]
            , div [ class "column center", style "flex-grow" "3" ]
                [ div [ class "row no-grow" ]
                    [ input
                        [ type_ "text"
                        , placeholder "Description"
                        , onInput EditedDescription
                        , name "description"
                        , value description
                        , style "width" "100%"
                        ]
                        []
                    ]
                , div [ class "row no-grow" ]
                    [ input
                        [ type_ "number"
                        , placeholder "Duration"
                        , onInput EditedDuration
                        , name "duration"
                        , value (duration |> Maybe.map String.fromInt |> Maybe.withDefault "")
                        ]
                        []
                    , selectPace pace
                    ]
                ]
            ]
        , div [ class "row no-grow" ]
            [ div [ class "column" ]
                [ submitButton model.status
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


viewError : Result Error Activity -> Html Msg
viewError errorR =
    case errorR of
        Err error ->
            div [ class "error" ] [ text <| errorMessage error ]

        _ ->
            div [ class "error" ] []


viewActivityShape : Result Error Activity -> Html msg
viewActivityShape activityR =
    case activityR of
        Ok activity ->
            ActivityShape.view activity.details

        _ ->
            ActivityShape.viewDefault


errorMessage : Error -> String
errorMessage error =
    case error of
        EmptyFieldError field ->
            "Please fill in " ++ field ++ " field"

        _ ->
            "There has been an error"

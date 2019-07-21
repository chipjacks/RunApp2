module ActivityForm exposing (Model, Msg(..), initEdit, initNew, isCreating, isEditing, update, view)

import Activity exposing (Activity, Minutes)
import ActivityShape
import Api
import Array exposing (Array)
import Date exposing (Date)
import Html exposing (Html, a, button, div, i, input, text)
import Html.Attributes exposing (class, href, id, name, placeholder, style, type_, value)
import Html.Events exposing (on, onClick, onInput)
import Json.Decode as Decode
import Skeleton exposing (column, compactColumn, expandingRow, row)
import Task exposing (Task)



{- GOOD EXAMPLE:
   https://github.com/rtfeldman/elm-spa-example/blob/master/src/Page/Settings.elm
-}


type alias Model =
    { status : Status
    , date : Date
    , form : Form
    , result : Result Error Activity
    }


type Status
    = Creating
    | Editing Activity.Id


type alias Form =
    { description : String
    , completed : Bool
    , duration : Maybe Minutes
    , pace : Maybe Activity.Pace
    }


type Msg
    = EditedDescription String
    | CheckedCompleted Bool
    | EditedDuration String
    | SelectedPace String
    | ClickedSubmit
    | ClickedReset
    | ClickedDelete
    | GotSubmitResult (Result Error (List Activity))
    | GotDeleteResult (Result Error (List Activity))


type Error
    = ApiError
    | EmptyFieldError String


initNew : Date -> Model
initNew date =
    Model Creating date (Form "" True Nothing Nothing) (Err (EmptyFieldError ""))


initEdit : Activity -> Model
initEdit activity =
    let
        form =
            Form activity.description activity.completed (Just activity.duration) activity.pace
    in
    Model (Editing activity.id) activity.date form (Ok activity)


isEditing : Activity -> Model -> Bool
isEditing activity model =
    case model.status of
        Editing id ->
            activity.id == id

        _ ->
            False


isCreating : Date -> Model -> Bool
isCreating date model =
    model.status == Creating && model.date == date


validateFieldExists : Maybe a -> String -> Result Error a
validateFieldExists fieldM fieldName =
    case fieldM of
        Just field ->
            Ok field

        Nothing ->
            Err <| EmptyFieldError fieldName


validate : Form -> Result Error Activity
validate form =
    Result.map2
        (\description duration ->
            Activity "" (Date.fromRataDie 0) description form.completed duration form.pace
        )
        (validateFieldExists (Just form.description) "description")
        (validateFieldExists form.duration "duration")


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        EditedDescription desc ->
            updateForm (\form -> { form | description = desc }) model

        CheckedCompleted bool ->
            updateForm (\form -> { form | completed = bool }) model

        EditedDuration str ->
            updateForm (\form -> { form | duration = String.toInt str }) model

        SelectedPace str ->
            updateForm (\form -> { form | pace = Activity.pace.fromString str }) model

        ClickedSubmit ->
            case model.result of
                Ok activity ->
                    let
                        apiTask =
                            case model.status of
                                Editing id ->
                                    Api.saveActivity { activity | date = model.date, id = id }

                                Creating ->
                                    Api.createActivity (\id -> { activity | date = model.date, id = id })
                    in
                    ( model, Task.attempt GotSubmitResult (apiTask |> Task.mapError (\_ -> ApiError)) )

                Err error ->
                    ( model, Cmd.none )

        ClickedReset ->
            ( initNew model.date, Cmd.none )

        ClickedDelete ->
            case model.status of
                Editing id ->
                    ( initNew model.date, Task.attempt GotDeleteResult (Api.deleteActivity id |> Task.mapError (\_ -> ApiError)) )

                _ ->
                    ( initNew model.date, Cmd.none )

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
    let
        updatedForm =
            transform model.form
    in
    ( { model | form = updatedForm, result = validate updatedForm }, Cmd.none )


view : Model -> Html Msg
view model =
    let
        { description, completed, duration, pace } =
            model.form

        activityShape =
            validate model.form
                |> Result.toMaybe
                |> Maybe.map ActivityShape.view
                |> Maybe.withDefault ActivityShape.viewDefault
    in
    row [ id "activity" ]
        [ compactColumn [ style "flex-basis" "5rem" ] [ activityShape ]
        , column []
            [ row []
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
            , row []
                [ durationInput EditedDuration duration
                , paceSelect SelectedPace pace
                , completedCheckbox completed
                ]
            , row []
                [ submitButton model.status
                , button
                    [ onClick ClickedReset
                    , type_ "reset"
                    , style "margin-left" "1em"
                    ]
                    [ text "Reset" ]
                , deleteButton model.status
                ]
            ]
        ]


completedCheckbox : Bool -> Html Msg
completedCheckbox completed =
    div []
        [ input
            [ type_ "checkbox"
            , Html.Attributes.checked completed
            , Html.Events.onCheck CheckedCompleted
            ]
            []
        , Html.label [] [ text "Completed" ]
        ]


submitButton : Status -> Html Msg
submitButton status =
    case status of
        Editing id ->
            button
                [ onClick ClickedSubmit
                , type_ "submit"
                , style "width" "10em"
                ]
                [ text "Save" ]

        Creating ->
            button
                [ onClick ClickedSubmit
                , type_ "submit"
                , style "width" "10em"
                ]
                [ text "Create" ]


deleteButton : Status -> Html Msg
deleteButton status =
    case status of
        Editing id ->
            button
                [ onClick ClickedDelete
                , name "delete"
                , style "margin-left" "1em"
                ]
                [ text "Delete" ]

        Creating ->
            div [] []


durationInput : (String -> Msg) -> Maybe Activity.Minutes -> Html Msg
durationInput msg duration =
    input
        [ type_ "number"
        , placeholder "Mins"
        , onInput msg
        , name "duration"
        , style "width" "3rem"
        , value (duration |> Maybe.map String.fromInt |> Maybe.withDefault "")
        ]
        []


paceSelect : (String -> Msg) -> Maybe Activity.Pace -> Html Msg
paceSelect msg paceM =
    let
        selected =
            case paceM of
                Just pace ->
                    Activity.pace.toString pace

                Nothing ->
                    ""

        selectedAttr paceStr =
            if selected == paceStr then
                [ Html.Attributes.attribute "selected" "" ]

            else
                []
    in
    Html.select
        [ onInput msg
        , name "pace"
        ]
        (List.map
            (\( paceStr, _ ) ->
                Html.option (selectedAttr paceStr) [ Html.text paceStr ]
            )
            (( "", Activity.Easy ) :: Activity.pace.list)
        )


viewError : Result Error Activity -> Html Msg
viewError errorR =
    case errorR of
        Err error ->
            div [ class "error" ] [ text <| errorMessage error ]

        _ ->
            div [ class "error" ] []


errorMessage : Error -> String
errorMessage error =
    case error of
        EmptyFieldError field ->
            "Please fill in " ++ field ++ " field"

        _ ->
            "There has been an error"

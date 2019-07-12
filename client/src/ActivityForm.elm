module ActivityForm exposing (Model, Msg(..), initEdit, initNew, isCreating, isEditing, update, view)

import Activity exposing (Activity, Details(..), Minutes)
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
    , details : DetailsForm
    }


type DetailsForm
    = RunForm { duration : Maybe Minutes, pace : Activity.Pace }
    | OtherForm { duration : Maybe Minutes }


type Msg
    = EditedDescription String
    | CheckedCompleted Bool
    | SelectedDetails String
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
    Model Creating date (Form "" True (RunForm { duration = Nothing, pace = Activity.Easy })) (Err (EmptyFieldError ""))


initEdit : Activity -> Model
initEdit activity =
    let
        form =
            case activity.details of
                Activity.Run minutes pace ->
                    Form activity.description activity.completed <|
                        RunForm { duration = Just minutes, pace = pace }

                Activity.Other minutes ->
                    Form activity.description activity.completed <|
                        OtherForm { duration = Just minutes }
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
        (\description details ->
            Activity "" (Date.fromRataDie 0) description form.completed details
        )
        (validateFieldExists (Just form.description) "description")
        (validateDetails form.details)


validateDetails : DetailsForm -> Result Error Activity.Details
validateDetails detailsForm =
    case detailsForm of
        RunForm { duration, pace } ->
            Result.map
                (\duration_ -> Activity.Run duration_ pace)
                (validateFieldExists duration "duration")

        OtherForm { duration } ->
            Result.map Activity.Other (validateFieldExists duration "duration")


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        EditedDescription desc ->
            updateForm (\form -> { form | description = desc }) model

        CheckedCompleted bool ->
            updateForm (\form -> { form | completed = bool }) model

        SelectedDetails str ->
            let
                details =
                    case str of
                        "Run" ->
                            RunForm { duration = Nothing, pace = Activity.Easy }

                        _ ->
                            OtherForm { duration = Nothing }
            in
            updateForm (\form -> { form | details = details }) model

        EditedDuration str ->
            let
                updatedDetails =
                    case model.form.details of
                        RunForm runForm ->
                            RunForm { runForm | duration = String.toInt str }

                        OtherForm otherForm ->
                            OtherForm { otherForm | duration = String.toInt str }
            in
            updateForm (\form -> { form | details = updatedDetails }) model

        SelectedPace str ->
            let
                updatedDetails =
                    case model.form.details of
                        RunForm runForm ->
                            RunForm { runForm | pace = Activity.pace.fromString str |> Maybe.withDefault runForm.pace }

                        _ ->
                            model.form.details
            in
            updateForm (\form -> { form | details = updatedDetails }) model

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
        { description, completed, details } =
            model.form

        activityShape =
            validateDetails details
                |> Result.toMaybe
                |> Maybe.map (ActivityShape.view completed)
                |> Maybe.withDefault ActivityShape.viewDefault
    in
    row [ id "activity" ]
        [ compactColumn [ style "flex-basis" "5rem" ] [ activityShape ]
        , column []
            [ row []
                [ detailsSelect details
                , completedCheckbox completed
                ]
            , row []
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
            , viewDetailsForm details
            , viewError model.result
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


detailsSelect : DetailsForm -> Html Msg
detailsSelect details =
    let
        detailsFormType =
            case details of
                RunForm _ ->
                    "Run"

                OtherForm _ ->
                    "Other"

        radioButton typeStr iconStr =
            button
                [ Html.Attributes.classList [ ( "selected", detailsFormType == typeStr ) ]
                , onClick <| SelectedDetails typeStr
                ]
                [ i [ class <| "fas fa-" ++ iconStr, style "padding-right" "0.5rem" ] []
                , text typeStr
                ]
    in
    div [ class "radio-buttons" ]
        [ radioButton "Run" "square"
        , radioButton "Other" "circle"
        ]


viewDetailsForm : DetailsForm -> Html Msg
viewDetailsForm detailsForm =
    case detailsForm of
        RunForm { duration, pace } ->
            row []
                [ durationInput EditedDuration duration
                , paceSelect SelectedPace pace
                ]

        OtherForm { duration } ->
            row []
                [ durationInput EditedDuration duration ]


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


paceSelect : (String -> Msg) -> Activity.Pace -> Html Msg
paceSelect msg pace =
    let
        selected =
            Activity.pace.toString pace

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
            Activity.pace.list
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

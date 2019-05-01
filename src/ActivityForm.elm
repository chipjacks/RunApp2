module ActivityForm exposing (Model, Msg(..), dateRequested, initEdit, initNew, selectDate, update, view)

import Activity exposing (Activity, Details(..), Interval(..), Minutes)
import ActivityShape
import Api
import Array exposing (Array)
import Date exposing (Date)
import Html exposing (Html, button, div, input, text)
import Html.Attributes exposing (class, id, name, placeholder, style, type_, value)
import Html.Events exposing (on, onClick, onInput)
import Json.Decode as Decode
import Skeleton exposing (column, expandingRow, row, twoColumns)
import Task exposing (Task)



{- GOOD EXAMPLE:
   https://github.com/rtfeldman/elm-spa-example/blob/master/src/Page/Settings.elm
-}


type alias Model =
    { status : Status
    , form : Form
    , result : Result Error Activity
    }


type Status
    = Creating
    | Editing Activity.Id


type alias Form =
    { date : Maybe Date
    , description : String
    , details : DetailsForm
    }


type DetailsForm
    = RunForm IntervalForm
    | IntervalsForm (Array IntervalForm)
    | OtherForm { duration : Maybe Minutes }


type alias IntervalForm =
    { duration : Maybe Minutes
    , pace : Maybe Activity.Pace
    }


type Msg
    = EditedDescription String
    | SelectedDetails String
    | EditedDuration String
    | SelectedPace String
    | EditedIntervalDuration Int String
    | SelectedIntervalPace Int String
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
    Model Creating (Form Nothing "" (RunForm { duration = Nothing, pace = Nothing })) (Err (EmptyFieldError ""))


initEdit : Activity -> Model
initEdit activity =
    let
        form =
            case activity.details of
                Activity.Run (Activity.Interval minutes pace) ->
                    Form (Just activity.date) activity.description <|
                        RunForm { duration = Just minutes, pace = Just pace }

                Activity.Intervals intervals ->
                    Form (Just activity.date) activity.description <|
                        IntervalsForm
                            (Array.fromList <|
                                List.map
                                    (\(Interval minutes pace) -> { duration = Just minutes, pace = Just pace })
                                    intervals
                            )

                Activity.Other minutes ->
                    Form (Just activity.date) activity.description <|
                        OtherForm { duration = Just minutes }
    in
    Model (Editing activity.id) form (Ok activity)


dateRequested : Model -> Bool
dateRequested model =
    case model.form.date of
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
    Result.map3
        (\date description details ->
            Activity "" date description details
        )
        (validateFieldExists form.date "date")
        (validateFieldExists (Just form.description) "description")
        (validateDetails form.details)


validateDetails : DetailsForm -> Result Error Activity.Details
validateDetails detailsForm =
    case detailsForm of
        RunForm { duration, pace } ->
            Result.map2
                (\duration_ pace_ -> Activity.Run (Activity.Interval duration_ pace_))
                (validateFieldExists duration "duration")
                (validateFieldExists pace "pace")

        OtherForm { duration } ->
            Result.map Activity.Other (validateFieldExists duration "duration")

        IntervalsForm intervals ->
            Array.foldr
                (\{ duration, pace } res ->
                    Result.map3
                        (\intervals_ duration_ pace_ ->
                            Activity.Interval duration_ pace_ :: intervals_
                        )
                        res
                        (validateFieldExists duration "duration")
                        (validateFieldExists pace "pace")
                )
                (Ok [])
                intervals
                |> Result.map Activity.Intervals


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        EditedDescription desc ->
            updateForm (\form -> { form | description = desc }) model

        SelectedDetails str ->
            let
                details =
                    case str of
                        "Run" ->
                            RunForm { duration = Nothing, pace = Nothing }

                        "Intervals" ->
                            IntervalsForm Array.empty

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

                        _ ->
                            model.form.details
            in
            updateForm (\form -> { form | details = updatedDetails }) model

        SelectedPace str ->
            let
                updatedDetails =
                    case model.form.details of
                        RunForm runForm ->
                            RunForm { runForm | pace = Activity.pace.fromString str }

                        _ ->
                            model.form.details
            in
            updateForm (\form -> { form | details = updatedDetails }) model

        EditedIntervalDuration index str ->
            updateInterval index (\interval -> { interval | duration = String.toInt str }) model

        SelectedIntervalPace index str ->
            updateInterval index (\interval -> { interval | pace = Activity.pace.fromString str }) model

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
                                Editing id ->
                                    Api.saveActivity { activity | id = id }

                                Creating ->
                                    Api.createActivity (\id -> { activity | id = id })
                    in
                    ( initNew, Task.attempt GotSubmitResult (apiTask |> Task.mapError (\_ -> ApiError)) )

                Err error ->
                    ( model, Cmd.none )

        ClickedReset ->
            ( initNew, Cmd.none )

        ClickedDelete ->
            case model.status of
                Editing id ->
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
    let
        updatedForm =
            transform model.form
    in
    ( { model | form = updatedForm, result = validate updatedForm }, Cmd.none )


updateInterval : Int -> (IntervalForm -> IntervalForm) -> Model -> ( Model, Cmd Msg )
updateInterval index transform model =
    let
        updatedDetails =
            case model.form.details of
                IntervalsForm intervals ->
                    Array.get index intervals
                        |> Maybe.map transform
                        |> Maybe.map (\interval -> Array.set index interval intervals)
                        |> Maybe.map IntervalsForm
                        |> Maybe.withDefault model.form.details

                _ ->
                    model.form.details
    in
    updateForm (\form -> { form | details = updatedDetails }) model


view : Model -> Html Msg
view model =
    let
        { date, description, details } =
            model.form

        detailsFormType =
            case model.form.details of
                RunForm _ ->
                    "Run"

                IntervalsForm _ ->
                    "Intervals"

                OtherForm _ ->
                    "Other"
    in
    column [ id "activity", style "justify-content" "space-between" ]
        [ row []
            [ column []
                [ selectDateButton date
                , viewError model.result
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
                    , Html.select
                        [ onInput SelectedDetails
                        , name "details"
                        , value detailsFormType
                        ]
                        [ Html.option [] [ Html.text "Run" ]
                        , Html.option [] [ Html.text "Intervals" ]
                        , Html.option [] [ Html.text "Other" ]
                        ]
                    ]
                ]
            ]
        , viewDetailsForm details
        , row []
            [ column []
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


viewDetailsForm : DetailsForm -> Html Msg
viewDetailsForm detailsForm =
    let
        activityShape =
            validateDetails detailsForm
                |> Result.toMaybe
                |> Maybe.map ActivityShape.view
                |> Maybe.withDefault ActivityShape.viewDefault
    in
    case detailsForm of
        RunForm { duration, pace } ->
            row [] <|
                twoColumns
                    [ activityShape ]
                    [ row []
                        [ input
                            [ type_ "number"
                            , placeholder "Duration"
                            , onInput EditedDuration
                            , name "duration"
                            , value (duration |> Maybe.map String.fromInt |> Maybe.withDefault "")
                            ]
                            []
                        , selectPace SelectedPace pace
                        ]
                    ]

        OtherForm { duration } ->
            row []
                [ input
                    [ type_ "number"
                    , placeholder "Duration"
                    , onInput EditedDuration
                    , name "duration"
                    , value (duration |> Maybe.map String.fromInt |> Maybe.withDefault "")
                    ]
                    []
                ]

        IntervalsForm intervals ->
            row []
                [ column [] <|
                    Array.toList <|
                        Array.indexedMap
                            (\index interval -> viewIntervalForm index interval)
                            intervals
                ]


viewIntervalForm : Int -> IntervalForm -> Html Msg
viewIntervalForm index interval =
    let
        activityShape =
            case validateDetails (RunForm interval) of
                Ok activityDetails ->
                    ActivityShape.view activityDetails

                Err _ ->
                    ActivityShape.viewDefault
    in
    row [] <|
        twoColumns
            [ activityShape ]
            [ row []
                [ input
                    [ type_ "number"
                    , placeholder "Duration"
                    , onInput (EditedIntervalDuration index)
                    , name "duration"
                    , value (interval.duration |> Maybe.map String.fromInt |> Maybe.withDefault "")
                    ]
                    []
                , selectPace (SelectedIntervalPace index) interval.pace
                ]
            ]


submitButton : Status -> Html Msg
submitButton status =
    case status of
        Editing id ->
            button
                [ onClick ClickedSubmit
                , type_ "submit"
                ]
                [ text "Save" ]

        Creating ->
            button
                [ onClick ClickedSubmit
                , type_ "submit"
                ]
                [ text "Create" ]


deleteButton : Status -> Html Msg
deleteButton status =
    case status of
        Editing id ->
            button
                [ onClick ClickedDelete
                , name "delete"
                ]
                [ text "Delete" ]

        Creating ->
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


selectPace : (String -> Msg) -> Maybe Activity.Pace -> Html Msg
selectPace msg paceM =
    Html.select
        [ onInput msg
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


errorMessage : Error -> String
errorMessage error =
    case error of
        EmptyFieldError field ->
            "Please fill in " ++ field ++ " field"

        _ ->
            "There has been an error"

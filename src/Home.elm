module Home exposing (Model, Msg, init, parseUrl, update, view)

import Activity exposing (Activity)
import ActivityForm
import Api
import Array
import Browser.Dom as Dom
import Calendar
import Config exposing (config)
import Date exposing (Date, Interval(..), Unit(..))
import Html exposing (Html, a, button, div, i, text)
import Html.Attributes exposing (class, href, id, style)
import Html.Events exposing (on, onClick)
import Http
import Link
import Skeleton exposing (column, compactColumn, expandingRow, row)
import Task
import Time exposing (Month(..))
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), (<?>))
import Url.Parser.Query as Query
import Window exposing (Window)



-- INITIALIZING MODEL


type Model
    = Loading Msg (Maybe Date) (Maybe (List Activity))
    | Loaded State


type alias State =
    { calendar : Calendar.Model
    , date : Date
    , activities : List Activity
    , activityForm : ActivityForm.Model
    }


init : Msg -> ( Model, Cmd Msg )
init msg =
    ( Loading msg Nothing Nothing
    , Cmd.batch
        [ Task.perform (\d -> LoadCalendar Calendar.Daily (Just d)) Date.today
        , Task.attempt GotActivities Api.getActivities
        ]
    )



-- UPDATING MODEL


type Msg
    = LoadCalendar Calendar.Model (Maybe Date)
    | LoadToday
    | LoadActivity Activity.Id
    | GotActivities (Result Http.Error (List Activity))
    | NewActivity (Maybe Date)
    | EditActivity Activity
    | ActivityFormMsg ActivityForm.Msg
    | NoOp


parseUrl : Parser.Parser (Msg -> b) b
parseUrl =
    let
        weeklyCalendar dateStrM =
            LoadCalendar Calendar.Weekly (parseDate dateStrM)

        dailyCalendar dateStrM =
            LoadCalendar Calendar.Daily (parseDate dateStrM)

        newActivity dateStrM =
            NewActivity (parseDate dateStrM)

        existingActivity id =
            LoadActivity id

        parseDate dateStrM =
            Date.fromIsoString (Maybe.withDefault "" dateStrM)
                |> Result.toMaybe
    in
    Parser.oneOf
        [ Parser.map weeklyCalendar (Parser.s "calendar" </> Parser.s "weekly" <?> Query.string "date")
        , Parser.map dailyCalendar (Parser.s "calendar" </> Parser.s "daily" <?> Query.string "date")
        , Parser.map newActivity (Parser.s "activity" </> Parser.s "new" <?> Query.string "date")
        , Parser.map existingActivity (Parser.s "activity" </> Parser.string)
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case model of
        Loading queuedMsg dateM activitiesM ->
            case msg of
                LoadCalendar calendar date ->
                    Loading queuedMsg date activitiesM
                        |> updateLoading

                GotActivities activitiesR ->
                    case activitiesR of
                        Ok activities ->
                            Loading queuedMsg dateM (Just activities)
                                |> updateLoading

                        _ ->
                            ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        Loaded state ->
            case msg of
                LoadCalendar calendar dateM ->
                    ( Loaded { state | calendar = calendar, date = dateM |> Maybe.withDefault state.date }
                    , Calendar.resetScroll NoOp
                    )

                LoadToday ->
                    ( model
                    , Task.perform (\d -> LoadCalendar state.calendar (Just d)) Date.today
                    )

                LoadActivity id ->
                    let
                        activityM =
                            state.activities |> List.filter (\a -> a.id == id) |> List.head
                    in
                    case activityM of
                        Just activity ->
                            ( Loaded { state | activityForm = ActivityForm.initEdit activity }
                            , Cmd.none
                            )

                        Nothing ->
                            -- TODO: error handling
                            ( model, Cmd.none )

                GotActivities result ->
                    case result of
                        Ok activities ->
                            ( Loaded { state | activities = activities }, Cmd.none )

                        _ ->
                            ( model, Cmd.none )

                EditActivity activity ->
                    ( Loaded { state | activityForm = ActivityForm.initEdit activity }, Cmd.none )

                NewActivity dateM ->
                    let
                        date =
                            dateM |> Maybe.withDefault state.date
                    in
                    ( Loaded { state | date = date, activityForm = ActivityForm.initNew date }
                    , Cmd.none
                    )

                ActivityFormMsg subMsg ->
                    let
                        newState =
                            case subMsg of
                                ActivityForm.GotSubmitResult (Ok activities) ->
                                    { state | activities = activities }

                                ActivityForm.GotDeleteResult (Ok activities) ->
                                    { state | activities = activities }

                                _ ->
                                    state

                        ( subModel, subCmd ) =
                            ActivityForm.update subMsg state.activityForm
                    in
                    ( Loaded { newState | activityForm = subModel }, Cmd.map ActivityFormMsg subCmd )

                NoOp ->
                    ( model, Cmd.none )


updateLoading : Model -> ( Model, Cmd Msg )
updateLoading model =
    case model of
        Loading queuedMsg (Just date) (Just activities) ->
            (Loaded <|
                State
                    Calendar.Daily
                    date
                    activities
                    (ActivityForm.initNew date)
            )
                |> update queuedMsg

        _ ->
            ( model, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    expandingRow
        [ id "home"
        , style "overflow" "hidden"
        ]
    <|
        case model of
            Loading _ _ _ ->
                [ text "Loading" ]

            Loaded state ->
                [ viewCalendar state ]


viewCalendar : State -> Html Msg
viewCalendar state =
    let
        calendarIcon =
            case state.calendar of
                Calendar.Weekly ->
                    [ i [ class "far fa-calendar-minus" ] [] ]

                _ ->
                    [ i [ class "far fa-calendar-alt" ] [] ]

        ( loadDate, toggleCalendar ) =
            case state.calendar of
                Calendar.Weekly ->
                    ( Link.toWeeklyCalendar
                    , Link.toDailyCalendar state.date
                    )

                Calendar.Daily ->
                    ( Link.toDailyCalendar
                    , Link.toWeeklyCalendar state.date
                    )

        accessActivities =
            \date ->
                List.filter (\a -> a.date == date) state.activities
    in
    column [ style "border-right" "1px solid #f1f1f1" ]
        [ row []
            [ a [ class "button", href toggleCalendar ] calendarIcon
            , div [ class "dropdown", style "margin-left" "0.5rem" ]
                [ button [ style "width" "6rem" ]
                    [ text (Date.format "MMMM" state.date)
                    ]
                , div [ class "dropdown-content", style "width" "6rem" ]
                    (listMonths state.date loadDate)
                ]
            , div [ class "dropdown", style "margin-left" "0.5rem" ]
                [ button [ style "width" "4rem" ]
                    [ text (Date.format "yyyy" state.date)
                    ]
                , div [ class "dropdown-content", style "width" "4rem" ]
                    (listYears state.date loadDate)
                ]
            , button
                [ style "margin-left" "0.5rem"
                , onClick LoadToday
                ]
                [ text "Today" ]
            ]
        , Calendar.view (\d -> LoadCalendar state.calendar (Just d)) accessActivities state.date state.calendar
        ]


listMonths : Date -> (Date -> String) -> List (Html msg)
listMonths date changeDate =
    let
        start =
            Date.fromCalendarDate (Date.year date) Jan 1

        end =
            Date.fromCalendarDate (Date.add Years 1 date |> Date.year) Jan 1
    in
    Date.range Month 1 start end
        |> List.map (viewDropdownItem changeDate "MMMM")


listYears : Date -> (Date -> String) -> List (Html msg)
listYears date changeDate =
    let
        middle =
            Date.fromCalendarDate 2019 (Date.month date) 1

        start =
            Date.add Years -3 middle

        end =
            Date.add Years 3 middle
    in
    Date.range Month 12 start end
        |> List.map (viewDropdownItem changeDate "yyyy")


viewDropdownItem : (Date -> String) -> String -> Date -> Html msg
viewDropdownItem changeDate formatDate date =
    a [ href (changeDate date) ] [ text <| Date.format formatDate date ]

module Main exposing (main)

import Activity exposing (Activity)
import ActivityForm
import ActivityShape
import Api
import Array
import Browser
import Browser.Dom as Dom
import Config exposing (config)
import Date exposing (Date, Interval(..), Unit(..))
import Html exposing (Html, a, button, div, i, text)
import Html.Attributes exposing (attribute, class, href, id, style)
import Html.Events exposing (on, onClick)
import Http
import Json.Decode as Decode
import Skeleton exposing (column, compactColumn, expandingRow, row)
import Task
import Time exposing (Month(..))
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), (<?>))
import Url.Parser.Query as Query
import Window exposing (Window)



-- INIT


main =
    Browser.document
        { init = init
        , view = \m -> { title = "Home | RunApp2", body = view m |> Skeleton.layout |> List.singleton }
        , update = update
        , subscriptions = subscriptions
        }


type Model
    = Loading (Maybe Date) (Maybe (List Activity))
    | Loaded State


type alias State =
    { calendar : CalendarView
    , date : Date
    , activities : List Activity
    , activityForm : ActivityForm.Model
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( Loading Nothing Nothing
    , Cmd.batch
        [ Task.perform (\d -> LoadCalendar Daily d) Date.today
        , Task.attempt GotActivities Api.getActivities
        ]
    )



-- UPDATING MODEL


type Msg
    = LoadCalendar CalendarView Date
    | LoadToday
    | LoadActivity Activity.Id
    | GotActivities (Result Http.Error (List Activity))
    | NewActivity (Maybe Date)
    | EditActivity Activity
    | ActivityFormMsg ActivityForm.Msg
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case model of
        Loading dateM activitiesM ->
            case msg of
                LoadCalendar calendar date ->
                    Loading (Just date) activitiesM
                        |> updateLoading

                GotActivities activitiesR ->
                    case activitiesR of
                        Ok activities ->
                            Loading dateM (Just activities)
                                |> updateLoading

                        _ ->
                            ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        Loaded state ->
            case msg of
                LoadCalendar calendar date ->
                    ( Loaded { state | calendar = calendar, date = date }
                    , resetScroll NoOp
                    )

                LoadToday ->
                    ( model
                    , Task.perform (LoadCalendar state.calendar) Date.today
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
        Loading (Just date) (Just activities) ->
            (Loaded <|
                State
                    Daily
                    date
                    activities
                    (ActivityForm.initNew date)
            )
                |> update NoOp

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
            Loading _ _ ->
                [ text "Loading" ]

            Loaded state ->
                [ column [ style "border-right" "1px solid #f1f1f1" ]
                    [ viewMenu state.calendar state.date
                    , viewCalendar state.calendar state.date state.activities
                    ]
                ]



-- VIEW MENU


viewMenu : CalendarView -> Date -> Html Msg
viewMenu calendar date =
    let
        calendarIcon =
            case calendar of
                Weekly ->
                    [ i [ class "far fa-calendar-minus" ] [] ]

                _ ->
                    [ i [ class "far fa-calendar-alt" ] [] ]

        ( loadDate, toggleCalendar ) =
            case calendar of
                Weekly ->
                    ( LoadCalendar Weekly
                    , LoadCalendar Daily date
                    )

                Daily ->
                    ( LoadCalendar Daily
                    , LoadCalendar Weekly date
                    )
    in
    row []
        [ a [ class "button", onClick toggleCalendar ] calendarIcon
        , div [ class "dropdown", style "margin-left" "0.5rem" ]
            [ button [ style "width" "6rem" ]
                [ text (Date.format "MMMM" date)
                ]
            , div [ class "dropdown-content", style "width" "6rem" ]
                (listMonths date loadDate)
            ]
        , div [ class "dropdown", style "margin-left" "0.5rem" ]
            [ button [ style "width" "4rem" ]
                [ text (Date.format "yyyy" date)
                ]
            , div [ class "dropdown-content", style "width" "4rem" ]
                (listYears date loadDate)
            ]
        , button
            [ style "margin-left" "0.5rem"
            , onClick LoadToday
            ]
            [ text "Today" ]
        ]


listMonths : Date -> (Date -> Msg) -> List (Html Msg)
listMonths date changeDate =
    let
        start =
            Date.fromCalendarDate (Date.year date) Jan 1

        end =
            Date.fromCalendarDate (Date.add Years 1 date |> Date.year) Jan 1
    in
    Date.range Month 1 start end
        |> List.map (viewDropdownItem changeDate "MMMM")


listYears : Date -> (Date -> Msg) -> List (Html Msg)
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


viewDropdownItem : (Date -> Msg) -> String -> Date -> Html Msg
viewDropdownItem changeDate formatDate date =
    a [ onClick (changeDate date) ] [ text <| Date.format formatDate date ]



-- VIEW CALENDAR


type CalendarView
    = Weekly
    | Daily


viewCalendar : CalendarView -> Date -> List Activity -> Html Msg
viewCalendar calendar date activities =
    let
        accessActivities =
            \date_ ->
                List.filter (\a -> a.date == date_) activities

        body =
            case calendar of
                Weekly ->
                    weekList date |> List.map viewWeek

                Daily ->
                    listDays date
                        |> List.map (\d -> ( d, accessActivities d ))
                        |> List.map viewDay
    in
    expandingRow
        [ id "calendar"
        , style "overflow" "scroll"
        , attribute "data-date" (Date.toIsoString date)
        , onScroll <| scrollHandler date calendar
        ]
        [ column [ style "margin-bottom" scrollConfig.marginBottom, style "justify-content" "space-between" ]
            body
        ]



-- SCROLLING


scrollConfig =
    { marginBottom = "-500px"
    , center = 250
    , loadPrevious = 10
    , loadNext = 490
    }


onScroll : ( msg, msg ) -> Html.Attribute msg
onScroll ( loadPrevious, loadNext ) =
    Html.Events.on "scroll"
        (Decode.at [ "target", "scrollTop" ] Decode.int
            |> Decode.andThen
                (\scrollTop ->
                    if scrollTop < scrollConfig.loadPrevious then
                        Decode.succeed loadPrevious

                    else if scrollTop > scrollConfig.loadNext then
                        Decode.succeed loadNext

                    else
                        Decode.fail ""
                )
        )


resetScroll : msg -> Cmd msg
resetScroll msg =
    Task.attempt
        (\_ -> msg)
        (Dom.setViewportOf "calendar" 0 scrollConfig.center)


scrollHandler : Date -> CalendarView -> ( Msg, Msg )
scrollHandler date calendar =
    (case calendar of
        Weekly ->
            ( Date.add Weeks -4 date, Date.add Weeks 4 date )

        Daily ->
            ( Date.add Days -3 date, Date.add Days 3 date )
    )
        |> Tuple.mapBoth (LoadCalendar calendar) (LoadCalendar calendar)



-- WEEKLY VIEW


viewWeek : Date -> Html Msg
viewWeek start =
    let
        days =
            daysOfWeek start
    in
    expandingRow [ style "min-height" "3rem" ] <|
        titleWeek start
            :: List.map viewWeekDay days


viewWeekDay : Date -> Html Msg
viewWeekDay date =
    column []
        [ a
            [ onClick (LoadCalendar Daily date)
            , attribute "data-date" (Date.toIsoString date)
            ]
            [ text (Date.format "d" date)
            ]
        ]


titleWeek : Date -> Html msg
titleWeek start =
    let
        monthStart =
            daysOfWeek start
                |> List.filter (\d -> Date.day d == 1)
                |> List.head
                |> Maybe.map (Date.format "MMM")
                |> Maybe.withDefault ""
    in
    div [ style "min-width" "3rem" ]
        [ text monthStart
        ]


weekList : Date -> List Date
weekList date =
    let
        start =
            Date.add Weeks -4 (Date.floor Week date)

        end =
            Date.add Weeks 12 start
    in
    Date.range Week 1 start end


daysOfWeek : Date -> List Date
daysOfWeek start =
    Date.range Day 1 start (Date.add Weeks 1 start)



-- DAILY VIEW


viewDay : ( Date, List Activity ) -> Html Msg
viewDay ( date, activities ) =
    row []
        [ column []
            [ row [ style "margin-top" "1rem", style "margin-bottom" "1rem" ]
                [ text (Date.format "E MMM d" date)
                , a [ onClick (NewActivity (Just date)) ] [ text "+" ]
                ]
            , row []
                [ viewActivities activities ]
            ]
        ]


listDays : Date -> List Date
listDays date =
    let
        start =
            Date.add Days -7 date

        end =
            Date.add Days 7 date
    in
    Date.range Day 1 start end


viewActivities : List Activity -> Html Msg
viewActivities activities =
    column [] (List.map viewActivity activities)


viewActivity : Activity -> Html Msg
viewActivity activity =
    a [ onClick (EditActivity activity) ]
        [ row [ style "margin-bottom" "1rem" ]
            [ compactColumn [ style "flex-basis" "5rem" ] [ ActivityShape.view activity.details ]
            , column [ style "justify-content" "center" ]
                [ text activity.description ]
            ]
        ]



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none

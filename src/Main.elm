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
        , view = \model -> { title = "Home | RunApp2", body = view model |> Skeleton.layout |> List.singleton }
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
    , activityForm : Maybe ActivityForm.Model
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
                    let
                        activityForm =
                            Maybe.map (ActivityForm.selectDate date) state.activityForm
                    in
                    ( Loaded { state | calendar = calendar, date = date, activityForm = activityForm }
                    , resetScroll NoOp
                    )

                LoadToday ->
                    ( model
                    , Task.perform (LoadCalendar state.calendar) Date.today
                    )

                GotActivities result ->
                    case result of
                        Ok activities ->
                            ( Loaded { state | activities = activities }, Cmd.none )

                        _ ->
                            ( model, Cmd.none )

                EditActivity activity ->
                    ( Loaded { state | activityForm = Just <| ActivityForm.initEdit activity }, Cmd.none )

                NewActivity dateM ->
                    let
                        date =
                            dateM |> Maybe.withDefault state.date
                    in
                    ( Loaded { state | date = date, activityForm = Just <| ActivityForm.initNew (Just date) }
                    , Cmd.none
                    )

                ActivityFormMsg subMsg ->
                    let
                        newState =
                            case subMsg of
                                ActivityForm.GotSubmitResult (Ok activities) ->
                                    { state | activities = activities, activityForm = Nothing }

                                ActivityForm.GotDeleteResult (Ok activities) ->
                                    { state | activities = activities, activityForm = Nothing }

                                ActivityForm.ClickedMove ->
                                    { state | calendar = Weekly }

                                _ ->
                                    state

                        ( subModel, subCmd ) =
                            case newState.activityForm of
                                Nothing ->
                                    ( Nothing, Cmd.none )

                                Just activityForm ->
                                    ActivityForm.update subMsg activityForm |> Tuple.mapFirst Just
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
                    Nothing
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
                [ column []
                    [ viewMenu state.calendar state.date
                    , viewCalendar state
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


viewCalendar : State -> Html Msg
viewCalendar { calendar, date, activities, activityForm } =
    let
        accessActivities =
            \date_ ->
                List.filter (filterActivities date_) activities

        filterActivities date_ activity =
            case activityForm of
                Just af ->
                    if af.date == Just date_ && ActivityForm.isEditing activity af then
                        True

                    else if activity.date == date_ && not (ActivityForm.isEditing activity af) then
                        True

                    else
                        False

                Nothing ->
                    activity.date == date_

        body =
            case calendar of
                Weekly ->
                    weekList date |> List.map (viewWeek accessActivities)

                Daily ->
                    listDays date
                        |> List.map (\d -> ( d, accessActivities d ))
                        |> List.map (viewDay activityForm)
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


viewWeek : (Date -> List Activity) -> Date -> Html Msg
viewWeek accessActivities start =
    let
        dayViews =
            daysOfWeek start
                |> List.map (\d -> ( d, accessActivities d ))
                |> List.map viewWeekDay

        ( runDuration, otherDuration ) =
            daysOfWeek start
                |> List.map (\d -> accessActivities d)
                |> List.concat
                |> List.filter (\a -> a.completed)
                |> List.partition (\a -> a.pace /= Nothing)
                |> Tuple.mapBoth (List.map (\a -> a.duration)) (List.map (\a -> a.duration))
                |> Tuple.mapBoth List.sum List.sum
    in
    expandingRow [ style "min-height" "3rem" ] <|
        titleWeek start ( runDuration, otherDuration )
            :: dayViews


viewWeekDay : ( Date, List Activity ) -> Html Msg
viewWeekDay ( date, activities ) =
    column [ style "overflow" "hidden" ] <|
        row [ style "justify-content" "center" ]
            [ a
                [ onClick (LoadCalendar Daily date)
                , attribute "data-date" (Date.toIsoString date)
                ]
                [ text (Date.format "d" date)
                ]
            ]
            :: List.map (\a -> row [ style "justify-content" "center", style "margin-bottom" "0.1rem" ] [ ActivityShape.viewCompact a ]) activities


titleWeek : Date -> ( Int, Int ) -> Html msg
titleWeek start ( runDuration, otherDuration ) =
    let
        monthStart =
            daysOfWeek start
                |> List.filter (\d -> Date.day d == 1)
                |> List.head
                |> Maybe.map (Date.format "MMM")
                |> Maybe.withDefault ""

        hours duration =
            (toFloat duration / 60)
                |> round

        minutes duration =
            remainderBy 60 duration
    in
    column [ style "min-width" "4rem" ]
        [ row [] [ text monthStart ]
        , row [ style "color" "limegreen" ]
            [ text <|
                if runDuration /= 0 then
                    List.foldr (++) "" [ String.fromInt (hours runDuration), "h ", String.fromInt (minutes runDuration), "m" ]

                else
                    ""
            ]
        , row [ style "color" "grey" ]
            [ text <|
                if otherDuration /= 0 then
                    List.foldr (++) "" [ String.fromInt (hours otherDuration), "h ", String.fromInt (minutes otherDuration), "m" ]

                else
                    ""
            ]
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


viewDay : Maybe ActivityForm.Model -> ( Date, List Activity ) -> Html Msg
viewDay activityFormM ( date, activities ) =
    let
        activityFormView =
            case activityFormM of
                Just af ->
                    if ActivityForm.isCreating date af then
                        ActivityForm.view af |> Html.map ActivityFormMsg

                    else
                        Html.text ""

                Nothing ->
                    Html.text ""
    in
    row []
        [ column []
            [ row [ style "margin-top" "1rem", style "margin-bottom" "1rem" ]
                [ text (Date.format "E MMM d" date)
                , a [ onClick (NewActivity (Just date)) ] [ text "+" ]
                ]
            , row []
                [ column [] (List.map (viewActivity activityFormM) activities) ]
            , activityFormView
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


viewActivity : Maybe ActivityForm.Model -> Activity -> Html Msg
viewActivity activityFormM activity =
    let
        activityView =
            a [ onClick (EditActivity activity) ]
                [ row [ style "margin-bottom" "1rem" ]
                    [ compactColumn [ style "flex-basis" "5rem" ] [ ActivityShape.view activity ]
                    , column [ style "justify-content" "center" ]
                        [ text activity.description ]
                    ]
                ]
    in
    case activityFormM of
        Just af ->
            if ActivityForm.isEditing activity af then
                ActivityForm.view af |> Html.map ActivityFormMsg

            else
                activityView

        Nothing ->
            activityView



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none

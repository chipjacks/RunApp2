module Calendar exposing (Model, Msg(..), getDate, init, update, view, weekly)

import Activity exposing (Activity, activityType)
import ActivityForm
import ActivityShape
import Browser.Dom as Dom
import Date exposing (Date, Interval(..), Unit(..))
import Html exposing (Html, a, button, div, i, text)
import Html.Attributes exposing (attribute, class, href, id, style)
import Html.Events exposing (on, onClick)
import Json.Decode as Decode
import Skeleton exposing (column, compactColumn, expandingRow, row, styleIf)
import Time exposing (Month(..))


type Model
    = Weekly Date
    | Daily Date


init : Date -> Model
init date =
    Daily date


type Msg
    = Jump Date
    | Toggle


weekly : Model -> Model
weekly model =
    case model of
        Daily date ->
            Weekly date

        _ ->
            model


getDate : Model -> Date
getDate model =
    case model of
        Weekly date ->
            date

        Daily date ->
            date


update : Msg -> Model -> Model
update msg model =
    case msg of
        Jump date ->
            case model of
                Weekly _ ->
                    Weekly date

                Daily _ ->
                    Daily date

        Toggle ->
            case model of
                Weekly date ->
                    Daily date

                Daily date ->
                    Weekly date



-- VIEW


viewMenu : Model -> Msg -> Html Msg
viewMenu model loadToday =
    let
        calendarIcon =
            case model of
                Weekly _ ->
                    [ i [ class "far fa-calendar-minus" ] [] ]

                _ ->
                    [ i [ class "far fa-calendar-alt" ] [] ]

        date =
            getDate model
    in
    row []
        [ a [ class "button", onClick Toggle ] calendarIcon
        , div [ class "dropdown", style "margin-left" "0.5rem" ]
            [ button []
                [ text (Date.format "MMMM" date)
                ]
            , div [ class "dropdown-content" ]
                (listMonths date Jump)
            ]
        , div [ class "dropdown", style "margin-left" "0.5rem" ]
            [ button []
                [ text (Date.format "yyyy" date)
                ]
            , div [ class "dropdown-content" ]
                (listYears date Jump)
            ]
        , button
            [ style "margin-left" "0.5rem"
            , onClick loadToday
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


viewDropdownItem : (Date -> Msg) -> String -> Date -> Html Msg
viewDropdownItem changeDate formatDate date =
    a [ onClick (changeDate date) ] [ text <| Date.format formatDate date ]


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


view : Model -> (Activity -> Html Msg) -> (Date -> Msg) -> Date -> List Activity -> Html Msg
view calendar viewActivity newActivity today activities =
    let
        accessActivities =
            \date_ ->
                List.filter (filterActivities date_) activities

        filterActivities date_ activity =
            activity.date == date_

        body =
            case calendar of
                Weekly date ->
                    weekList date |> List.map (viewWeek accessActivities today)

                Daily date ->
                    listDays date
                        |> List.map (\d -> viewDay d (accessActivities d) (d == today) viewActivity newActivity)
    in
    column []
        [ viewMenu calendar (Jump today)
        , column
            [ id "calendar"
            , style "overflow" "scroll"
            , attribute "overflow-anchor" "none"
            , onScroll <| scrollHandler calendar
            , style "scroll-snap-type" "y mandatory"
            ]
            body
        ]



-- SCROLLING


scrollConfig =
    { marginBottom = "-500px"
    , center = 250
    , loadMargin = 10
    }


onScroll : ( msg, msg ) -> Html.Attribute msg
onScroll ( loadPrevious, loadNext ) =
    Html.Events.on "scroll"
        (Decode.map3 (\a b c -> ( a, b, c ))
            (Decode.at [ "target", "scrollTop" ] Decode.int)
            (Decode.at [ "target", "scrollHeight" ] Decode.int)
            (Decode.at [ "target", "clientHeight" ] Decode.int)
            |> Decode.andThen
                (\( scrollTop, scrollHeight, clientHeight ) ->
                    if scrollTop < scrollConfig.loadMargin then
                        Decode.succeed loadPrevious

                    else if scrollTop > scrollHeight - clientHeight - scrollConfig.loadMargin then
                        Decode.succeed loadNext

                    else
                        Decode.fail ""
                )
        )


resetScroll : msg -> Cmd msg
resetScroll msg =
    Cmd.none


scrollToSelectedDate _ viewport calendar selectedDate =
    Dom.setViewportOf "calendar" 0 (viewport.viewport.y + selectedDate.element.y - calendar.element.y)


scrollHandler : Model -> ( Msg, Msg )
scrollHandler model =
    (case model of
        Weekly date ->
            ( Date.add Weeks -4 date, Date.add Weeks 4 date )

        Daily date ->
            ( Date.add Days -3 date, Date.add Days 3 date )
    )
        |> Tuple.mapBoth Jump Jump



-- WEEKLY VIEW


viewWeek : (Date -> List Activity) -> Date -> Date -> Html Msg
viewWeek accessActivities today start =
    let
        dayViews =
            daysOfWeek start
                |> List.map (\d -> viewWeekDay ( d, accessActivities d ) (d == today))

        activities =
            daysOfWeek start
                |> List.map (\d -> accessActivities d)
                |> List.concat

        ( runDuration, otherDuration ) =
            activities
                |> List.partition (\a -> activityType a == Activity.Run)
                |> Tuple.mapBoth (List.map (\a -> a.duration)) (List.map (\a -> a.duration))
                |> Tuple.mapBoth List.sum List.sum
    in
    row [] <|
        titleWeek start ( runDuration, otherDuration )
            :: dayViews


viewWeekDay : ( Date, List Activity ) -> Bool -> Html Msg
viewWeekDay ( date, activities ) isToday =
    column [ onClick (Jump date), style "min-height" "4rem", style "padding-bottom" "1rem" ] <|
        row []
            [ a
                [ attribute "data-date" (Date.toIsoString date)
                , styleIf isToday "text-decoration" "underline"
                ]
                [ text (Date.format "d" date)
                ]
            ]
            :: List.map (\a -> row [ style "margin-bottom" "0.1rem" ] [ ActivityShape.view a ]) activities


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
                |> Basics.floor

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


viewDay : Date -> List Activity -> Bool -> (Activity -> Html Msg) -> (Date -> Msg) -> Html Msg
viewDay date activities isToday viewActivity newActivity =
    row [ style "scroll-snap-align" "start", styleIf isToday "overflow-anchor" "auto" ]
        [ column []
            [ row [ styleIf isToday "font-weight" "bold" ]
                [ text (Date.format "E MMM d" date)
                , a [ onClick (newActivity date), style "margin-left" "0.2rem" ] [ text "+" ]
                ]
            , row [ style "margin" "1rem" ]
                [ column []
                    [ row []
                        [ column [] (List.map viewActivity activities) ]
                    ]
                ]
            ]
        ]


listDays : Date -> List Date
listDays date =
    let
        start =
            Date.add Days -3 date

        end =
            Date.add Days 11 date
    in
    Date.range Day 1 start end

module Calendar exposing (Model, Zoom(..), getDate, init, update, view, viewDatePicker, viewToggleButton)

import Activity exposing (Activity, activityType)
import ActivityForm
import ActivityShape
import Browser.Dom as Dom
import Date exposing (Date, Interval(..), Unit(..))
import Html exposing (Html, a, button, div, i, text)
import Html.Attributes exposing (attribute, class, href, id, style)
import Html.Events exposing (on, onClick)
import Json.Decode as Decode
import Msg exposing (Msg(..))
import Ports exposing (scrollToSelectedDate)
import Process
import Skeleton exposing (attributeIf, column, compactColumn, expandingRow, row, styleIf, viewIf)
import Task
import Time exposing (Month(..))


type alias Model =
    { zoom : Zoom, start : Date, selected : Date, end : Date, scrollCompleted : Bool }


type Zoom
    = Weekly
    | Daily


init : Zoom -> Date -> Model
init zoom date =
    Model zoom (Date.floor Year date) date (Date.ceiling Year date) True


getDate : Model -> Date
getDate { selected } =
    selected


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Jump date ->
            ( init model.zoom date, scrollToSelectedDate () )

        Toggle dateM ->
            case model.zoom of
                Weekly ->
                    ( init Daily (Maybe.withDefault model.selected dateM)
                    , scrollToSelectedDate ()
                    )

                Daily ->
                    ( init Weekly (Maybe.withDefault model.selected dateM)
                    , scrollToSelectedDate ()
                    )

        Scroll up date currentHeight ->
            if not model.scrollCompleted then
                ( model, Cmd.none )

            else if up then
                ( { model | start = date, scrollCompleted = False }
                , returnScroll currentHeight
                )

            else
                ( { model | end = date }
                , Cmd.none
                )

        ScrollCompleted result ->
            ( { model | scrollCompleted = True }
            , Cmd.none
            )

        ReceiveSelectDate selectDate ->
            let
                newSelected =
                    Date.fromIsoString selectDate |> Result.withDefault model.selected
            in
            ( { model | selected = newSelected }, Cmd.none )

        _ ->
            ( model, Cmd.none )



-- VIEW


viewToggleButton : Model -> Html Msg
viewToggleButton model =
    let
        calendarIcon =
            case model.zoom of
                Weekly ->
                    [ i [ class "far fa-calendar-minus" ] [] ]

                _ ->
                    [ i [ class "far fa-calendar-alt" ] [] ]
    in
    row []
        [ a [ class "button", onClick (Toggle Nothing) ] calendarIcon ]


viewDatePicker : Model -> Msg -> Html Msg
viewDatePicker model loadToday =
    row [ style "justify-content" "center" ]
        [ div [ class "dropdown" ]
            [ button []
                [ text (Date.format "MMMM" model.selected)
                ]
            , div [ class "dropdown-content" ]
                (listMonths model.selected Jump)
            ]
        , div [ class "dropdown", style "margin-left" "0.2rem" ]
            [ button []
                [ text (Date.format "yyyy" model.selected)
                ]
            , div [ class "dropdown-content" ]
                (listYears model.selected Jump)
            ]
        , button
            [ style "margin-left" "0.2rem"
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
            case calendar.zoom of
                Weekly ->
                    weekList calendar.start calendar.end |> List.map (viewWeek accessActivities today calendar.selected)

                Daily ->
                    listDays calendar.start calendar.end
                        |> List.map (\d -> viewDay d (accessActivities d) (d == today) (d == calendar.selected) viewActivity newActivity)
    in
    column [ style "margin-left" "1rem" ]
        [ viewIf (calendar.zoom == Weekly) viewWeekDaysHeader
        , column
            [ id "calendar"
            , style "overflow" "scroll"
            , attributeIf calendar.scrollCompleted (onScroll <| scrollHandler calendar)
            ]
            body
        ]



-- SCROLLING


onScroll : ( Int -> msg, Int -> msg ) -> Html.Attribute msg
onScroll ( loadPrevious, loadNext ) =
    let
        loadMargin =
            10
    in
    Html.Events.on "scroll"
        (Decode.map3 (\a b c -> ( a, b, c ))
            (Decode.at [ "target", "scrollTop" ] Decode.int)
            (Decode.at [ "target", "scrollHeight" ] Decode.int)
            (Decode.at [ "target", "clientHeight" ] Decode.int)
            |> Decode.andThen
                (\( scrollTop, scrollHeight, clientHeight ) ->
                    if scrollTop < loadMargin then
                        Decode.succeed (loadPrevious scrollHeight)

                    else if scrollTop > scrollHeight - clientHeight - loadMargin then
                        Decode.succeed (loadNext scrollHeight)

                    else
                        Decode.fail ""
                )
        )


returnScroll : Int -> Cmd Msg
returnScroll previousHeight =
    Dom.getViewportOf "calendar"
        |> Task.andThen
            (\info ->
                Task.sequence
                    [ Dom.setViewportOf "calendar" 0 (info.scene.height - toFloat previousHeight)
                    , Process.sleep 100
                    , Dom.setViewportOf "calendar" 0 (info.scene.height - toFloat previousHeight)
                    ]
            )
        |> Task.andThen (\_ -> Dom.getElement "calendar")
        |> Task.attempt (\result -> ScrollCompleted result)


scrollHandler : Model -> ( Int -> Msg, Int -> Msg )
scrollHandler model =
    ( Date.add Months -2 model.start, Date.add Months 2 model.end )
        |> Tuple.mapBoth (Scroll True) (Scroll False)



-- WEEKLY VIEW


viewWeekDaysHeader : Html msg
viewWeekDaysHeader =
    row [ style "opacity" "0.3" ]
        (column [ style "min-width" "4rem" ] []
            :: ([ "M", "T", "W", "R", "F", "S", "S" ] |> List.map (\d -> column [] [ text d ]))
        )


viewWeek : (Date -> List Activity) -> Date -> Date -> Date -> Html Msg
viewWeek accessActivities today selected start =
    let
        dayViews =
            daysOfWeek start
                |> List.map (\d -> viewWeekDay ( d, accessActivities d ) (d == today) (d == selected))

        activities =
            daysOfWeek start
                |> List.map (\d -> accessActivities d)
                |> List.concat

        ( runDuration, otherDuration ) =
            activities
                |> List.partition
                    (\a ->
                        case activityType a of
                            Activity.Run _ _ ->
                                True

                            Activity.Race _ _ ->
                                True

                            _ ->
                                False
                    )
                |> Tuple.mapBoth (List.filterMap .duration) (List.filterMap .duration)
                |> Tuple.mapBoth List.sum List.sum
    in
    row [] <|
        titleWeek start ( runDuration, otherDuration )
            :: dayViews


viewWeekDay : ( Date, List Activity ) -> Bool -> Bool -> Html Msg
viewWeekDay ( date, activities ) isToday isSelected =
    column
        [ onClick (Toggle (Just date))
        , attributeIf isSelected (id "selected-date")
        , style "min-height" "4rem"
        , style "padding-bottom" "1rem"
        ]
    <|
        row []
            [ a
                [ attribute "data-date" (Date.toIsoString date)
                , styleIf isToday "text-decoration" "underline"
                ]
                [ text (Date.format "d" date)
                ]
            ]
            :: List.map (\a -> row [ style "margin-bottom" "0.1rem", style "margin-right" "0.2rem" ] [ ActivityShape.view a ]) activities


titleWeek : Date -> ( Int, Int ) -> Html msg
titleWeek start ( runDuration, otherDuration ) =
    let
        monthStart =
            daysOfWeek start
                |> List.filter (\d -> Date.day d == 1)
                |> List.head

        hours duration =
            (toFloat duration / 60)
                |> Basics.floor

        minutes duration =
            remainderBy 60 duration
    in
    column [ style "min-width" "4rem" ]
        [ row
            (Maybe.map (\month -> [ class "month-header", attribute "data-date" (Date.toIsoString month) ]) monthStart
                |> Maybe.withDefault []
            )
            [ text
                (monthStart |> Maybe.map (Date.format "MMM") |> Maybe.withDefault "")
            ]
        , row [ style "color" "var(--activity-green)" ]
            [ text <|
                if runDuration /= 0 then
                    List.foldr (++) "" [ String.fromInt (hours runDuration), "h ", String.fromInt (minutes runDuration), "m" ]

                else
                    ""
            ]
        , row [ style "color" "var(--activity-gray)" ]
            [ text <|
                if otherDuration /= 0 then
                    List.foldr (++) "" [ String.fromInt (hours otherDuration), "h ", String.fromInt (minutes otherDuration), "m" ]

                else
                    ""
            ]
        ]


weekList : Date -> Date -> List Date
weekList start end =
    Date.range Week 1 (Date.floor Week start) end


daysOfWeek : Date -> List Date
daysOfWeek start =
    Date.range Day 1 start (Date.add Weeks 1 start)



-- DAILY VIEW


viewDay : Date -> List Activity -> Bool -> Bool -> (Activity -> Html Msg) -> (Date -> Msg) -> Html Msg
viewDay date activities isToday isSelected viewActivity newActivity =
    row
        [ attributeIf (Date.day date == 1) (class "month-header")
        , attributeIf isSelected (id "selected-date")
        , attribute "data-date" (Date.toIsoString date)
        ]
        [ column []
            [ row [ styleIf isToday "font-weight" "bold" ]
                [ text (Date.format "E MMM d" date)
                ]
            , row [ style "margin-top" "1rem" ]
                [ column [] (List.map viewActivity activities) ]
            , row [ style "margin-bottom" "1rem" ]
                [ compactColumn []
                    [ a
                        [ onClick (newActivity date)
                        , class "button tiny fas fa-plus"
                        , style "font-size" "0.6rem"
                        , style "padding" "0.3rem"
                        , style "color" "var(--icon-gray)"
                        ]
                        []
                    ]
                ]
            ]
        ]


listDays : Date -> Date -> List Date
listDays start end =
    Date.range Day 1 start end

module Calendar exposing (Model, getDate, init, update, view, viewMenu)

import Activity exposing (Activity)
import ActivityForm
import ActivityShape
import Browser.Dom as Dom
import Date exposing (Date)
import Html exposing (Html, a, button, div, i, text)
import Html.Attributes exposing (attribute, class, href, id, style)
import Html.Events exposing (on, onClick)
import Json.Decode as Decode
import Msg exposing (Msg(..), Zoom(..))
import Ports exposing (scrollToSelectedDate)
import Process
import Skeleton exposing (attributeIf, column, compactColumn, expandingRow, row, styleIf, viewIf, viewMaybe)
import Task
import Time exposing (Month(..))


type alias Model =
    { zoom : Zoom, start : Date, selected : Date, end : Date, scrollCompleted : Bool }


init : Zoom -> Date -> Model
init zoom date =
    Model zoom (Date.floor Date.Year date) date (Date.ceiling Date.Year date) True


getDate : Model -> Date
getDate { selected } =
    selected


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Jump date ->
            ( init model.zoom date, scrollToSelectedDate () )

        ChangeZoom zoom dateM ->
            ( init zoom (Maybe.withDefault model.selected dateM)
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



-- VIEW MENU


viewMenu : Model -> Msg -> Html Msg
viewMenu model loadToday =
    row []
        [ compactColumn [] [ viewBackButton model ]
        , column []
            [ row [ style "justify-content" "center" ]
                [ viewDatePicker model
                , button
                    [ style "margin-left" "0.2rem"
                    , onClick loadToday
                    ]
                    [ text "Today" ]
                ]
            ]
        ]


viewBackButton : Model -> Html Msg
viewBackButton model =
    case model.zoom of
        Year ->
            text ""

        Month ->
            a [ class "button", style "margin-right" "0.2rem", onClick (ChangeZoom Year Nothing) ]
                [ i [ class "fas fa-arrow-left", style "margin-right" "1rem" ] []
                , text (Date.format "yyyy" model.selected)
                ]

        Day ->
            a [ class "button", style "margin-right" "0.2rem", onClick (ChangeZoom Month Nothing) ]
                [ i [ class "fas fa-arrow-left", style "margin-right" "1rem" ] []
                , text (Date.format "MMMM yyyy" model.selected)
                ]


viewDatePicker : Model -> Html Msg
viewDatePicker model =
    case model.zoom of
        Year ->
            div [ class "dropdown" ]
                [ button []
                    [ text (Date.format "yyyy" model.selected)
                    ]
                , div [ class "dropdown-content" ]
                    (listYears model.selected Jump)
                ]

        Month ->
            div [ class "dropdown" ]
                [ button []
                    [ text (Date.format "MMMM" model.selected)
                    ]
                , div [ class "dropdown-content" ]
                    (listMonths model.selected Jump)
                ]

        Day ->
            text ""


listMonths : Date -> (Date -> Msg) -> List (Html Msg)
listMonths date changeDate =
    let
        start =
            Date.fromCalendarDate (Date.year date) Jan 1

        end =
            Date.fromCalendarDate (Date.add Date.Years 1 date |> Date.year) Jan 1
    in
    Date.range Date.Month 1 start end
        |> List.map (viewDropdownItem changeDate "MMMM")


listYears : Date -> (Date -> Msg) -> List (Html Msg)
listYears date changeDate =
    let
        middle =
            Date.fromCalendarDate 2019 (Date.month date) 1

        start =
            Date.add Date.Years -3 middle

        end =
            Date.add Date.Years 3 middle
    in
    Date.range Date.Month 12 start end
        |> List.map (viewDropdownItem changeDate "yyyy")


viewDropdownItem : (Date -> Msg) -> String -> Date -> Html Msg
viewDropdownItem changeDate formatDate date =
    a [ onClick (changeDate date) ] [ text <| Date.format formatDate date ]



-- VIEW


view : Model -> Date -> List Activity -> Maybe String -> List (Html Msg)
view calendar today activities selectedIdM =
    let
        filterActivities =
            \date -> List.filter (\a -> a.date == date) activities

        body =
            case calendar.zoom of
                Year ->
                    weekList calendar.start calendar.end
                        |> List.map
                            (\d ->
                                viewWeek filterActivities today calendar.selected d
                            )

                Month ->
                    listDays calendar.start calendar.end
                        |> List.map
                            (\d ->
                                viewDay d (filterActivities d) (d == today) (d == calendar.selected) selectedIdM
                            )

                Day ->
                    let
                        d =
                            calendar.selected
                    in
                    [ viewDay d (filterActivities d) (d == today) (d == calendar.selected) selectedIdM ]
    in
    [ viewIf (calendar.zoom == Year) viewHeader
    , expandingRow [ style "overflow" "hidden" ]
        [ column
            [ id "calendar"
            , style "overflow-y" "scroll"
            , style "overflow-x" "hidden"
            , style "padding-right" "0.5rem"
            , attributeIf calendar.scrollCompleted (onScroll <| scrollHandler calendar)
            ]
            body
        ]
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
    ( Date.add Date.Months -2 model.start, Date.add Date.Months 2 model.end )
        |> Tuple.mapBoth (Scroll True) (Scroll False)



-- YEAR VIEW


viewHeader : Html Msg
viewHeader =
    row []
        (column [ style "min-width" "4rem" ] []
            :: ([ "M", "T", "W", "T", "F", "S", "S" ]
                    |> List.map
                        (\d ->
                            column [ style "background" "white", style "color" "var(--icon-gray)" ]
                                [ text d ]
                        )
               )
        )


viewWeek : (Date -> List Activity) -> Date -> Date -> Date -> Html Msg
viewWeek filterActivities today selected start =
    let
        dayViews =
            daysOfWeek start
                |> List.map (\d -> viewWeekDay ( d, filterActivities d ) (d == today) (d == selected))

        activities =
            daysOfWeek start
                |> List.map (\d -> filterActivities d)
                |> List.concat

        ( runDuration, otherDuration ) =
            activities
                |> List.map
                    (\a ->
                        case a.data of
                            Activity.Run mins _ _ ->
                                ( mins, 0 )

                            Activity.Race mins _ _ ->
                                ( mins, 0 )

                            Activity.Other mins _ ->
                                ( 0, mins )

                            _ ->
                                ( 0, 0 )
                    )
                |> List.foldl (\( r, o ) ( sr, so ) -> ( sr + r, so + o )) ( 0, 0 )
    in
    row [] <|
        titleWeek start ( runDuration, otherDuration )
            :: dayViews


viewWeekDay : ( Date, List Activity ) -> Bool -> Bool -> Html Msg
viewWeekDay ( date, activities ) isToday isSelected =
    column
        [ onClick (ChangeZoom Month (Just date))
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
    Date.range Date.Week 1 (Date.floor Date.Week start) end


daysOfWeek : Date -> List Date
daysOfWeek start =
    Date.range Date.Day 1 start (Date.add Date.Weeks 1 start)



-- MONTH VIEW


viewDay : Date -> List Activity -> Bool -> Bool -> Maybe String -> Html Msg
viewDay date activities isToday isSelected selectedIdM =
    row
        [ attributeIf (Date.day date == 1) (class "month-header")
        , attributeIf isSelected (id "selected-date")
        , attribute "data-date" (Date.toIsoString date)
        , style "min-height" "3rem"
        , style "margin-bottom" "1rem"
        ]
        [ column []
            [ row [ styleIf isToday "font-weight" "bold", onClick (ChangeZoom Day (Just date)) ]
                [ text (Date.format "E MMM d" date)
                ]
            , row []
                [ column [] (List.map (viewActivity selectedIdM) activities) ]
            , row [ style "margin-top" "1rem" ]
                [ compactColumn []
                    [ a
                        [ onClick (ClickedNewActivity date)
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


viewActivity : Maybe String -> Activity -> Html Msg
viewActivity selectedIdM activity =
    let
        level =
            Activity.mprLevel activity
                |> Maybe.map (\l -> "level " ++ String.fromInt l)
                |> Maybe.withDefault ""

        isSelected =
            case selectedIdM of
                Just id ->
                    activity.id == id

                Nothing ->
                    False
    in
    a [ onClick (EditActivity activity) ]
        [ row [ style "margin-top" "1rem" ]
            [ compactColumn [ style "flex-basis" "5rem" ] [ ActivityShape.view activity ]
            , column [ style "justify-content" "center" ] <|
                if isSelected then
                    [ viewButtons activity ]

                else
                    [ row [] [ text activity.description ]
                    , row [ style "font-size" "0.8rem" ]
                        [ column []
                            [ text <|
                                case activity.data of
                                    Activity.Run mins pace_ _ ->
                                        String.fromInt mins ++ " min " ++ String.toLower (Activity.pace.toString pace_)

                                    Activity.Race mins _ _ ->
                                        String.fromInt mins ++ " min "

                                    Activity.Other mins _ ->
                                        String.fromInt mins ++ " min "

                                    _ ->
                                        ""
                            ]
                        , compactColumn [ style "align-items" "flex-end" ] [ text level ]
                        ]
                    ]
            ]
        ]


listDays : Date -> Date -> List Date
listDays start end =
    Date.range Date.Day 1 start end


viewButtons : Activity -> Html Msg
viewButtons activity =
    row [ style "flex-wrap" "wrap" ]
        [ a [ class "button small", style "margin-right" "0.2rem", onClick (ClickedCopy activity) ] [ i [ class "far fa-clone" ] [] ]
        , a [ class "button small", style "margin-right" "0.2rem", onClick (ClickedShift True) ] [ i [ class "fas fa-arrow-up" ] [] ]
        , a [ class "button small", style "margin-right" "0.2rem", onClick (ClickedShift False) ] [ i [ class "fas fa-arrow-down" ] [] ]
        , a [ class "button small", style "margin-right" "0.2rem", onClick ClickedMove ] [ i [ class "fas fa-arrow-right" ] [] ]
        , a [ class "button small", style "margin-right" "0.2rem", onClick ClickedDelete ] [ i [ class "fas fa-times" ] [] ]
        ]

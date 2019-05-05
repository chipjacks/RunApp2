module Calendar exposing (handleScroll, view)

import Date exposing (Date, Interval(..), Unit(..))
import Html exposing (Html, a, button, div, text)
import Html.Attributes exposing (attribute, class, href, id, style)
import Html.Events exposing (on, onClick)
import Json.Decode as Decode
import Link
import Scroll
import Skeleton exposing (column, expandingRow, row)
import Time exposing (Month(..))


view : (Date -> msg) -> (Int -> msg) -> Date -> Html msg
view changeDate scroll date =
    column []
        [ dateSelect date changeDate
        , dateGrid changeDate scroll date
        ]


dateGrid : (Date -> msg) -> (Int -> msg) -> Date -> Html msg
dateGrid changeDate scroll date =
    column
        [ id "calendar"
        , style "overflow" "scroll"
        , attribute "data-date" (Date.toIsoString date)
        , Scroll.on scroll
        ]
        [ column [ style "margin-bottom" Scroll.config.marginBottom ]
            (weekList date |> List.map viewWeek)
        ]


handleScroll : Int -> (Int -> msg) -> ( Date -> Date, Cmd msg )
handleScroll scrollTop scrollMsg =
    if scrollTop < Scroll.config.loadPrevious then
        ( Date.add Weeks -4, Scroll.reset scrollMsg "calendar" )

    else if scrollTop > Scroll.config.loadNext then
        ( Date.add Weeks 4, Scroll.reset scrollMsg "calendar" )

    else
        ( identity, Cmd.none )



-- DATE SELECTION


dateSelect : Date -> (Date -> msg) -> Html msg
dateSelect date changeDate =
    row []
        [ div [ class "dropdown" ]
            [ button [ style "width" "6rem" ]
                [ text (Date.format "MMMM" date)
                ]
            , div [ class "dropdown-content", style "width" "6rem" ]
                (listMonths date changeDate)
            ]
        , div [ class "dropdown", style "margin-left" "0.5rem" ]
            [ button [ style "width" "4rem" ]
                [ text (Date.format "yyyy" date)
                ]
            , div [ class "dropdown-content", style "width" "4rem" ]
                (listYears date changeDate)
            ]
        , a
            [ class "button"
            , style "margin-left" "0.5rem"
            , style "text-decoration" "none"
            , style "color" "black"
            , href (Link.toCalendar Nothing)
            ]
            [ text "Today" ]
        ]


listMonths : Date -> (Date -> msg) -> List (Html msg)
listMonths date changeDate =
    let
        start =
            Date.fromCalendarDate (Date.year date) Jan 1

        end =
            Date.fromCalendarDate (Date.add Years 1 date |> Date.year) Jan 1
    in
    Date.range Month 1 start end
        |> List.map (viewDropdownItem changeDate "MMMM")


listYears : Date -> (Date -> msg) -> List (Html msg)
listYears date changeDate =
    let
        middle =
            Date.fromCalendarDate 2019 Jan 1

        start =
            Date.add Years -3 middle

        end =
            Date.add Years 3 middle
    in
    Date.range Month 12 start end
        |> List.map (viewDropdownItem changeDate "yyyy")


viewDropdownItem : (Date -> msg) -> String -> Date -> Html msg
viewDropdownItem changeDate formatDate date =
    div [ onClick (changeDate date) ] [ text <| Date.format formatDate date ]



-- CALENDAR VIEW


viewWeek : Date -> Html msg
viewWeek start =
    let
        days =
            daysOfWeek start
    in
    expandingRow [ style "min-height" "3rem" ] <|
        titleWeek start
            :: List.map viewDay days


viewDay : Date -> Html msg
viewDay date =
    column []
        [ a
            [ href (Link.toActivityList (Just date))
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

module Calendar exposing (Model, view)

import Date exposing (Date, Interval(..), Unit(..))
import Html exposing (Html, a, div, text)
import Html.Attributes exposing (class, href, id, style)
import Html.Events exposing (onClick)
import Link
import Time exposing (Month(..))


type alias Model =
    { date : Date
    }


view : (Date -> msg) -> Model -> Html msg
view changeDate { date } =
    div [ class "column", id "calendar" ]
        [ dateSelect date changeDate
        , div [ class "ui grid" ]
            (weekList date |> List.map viewWeek)
        ]



-- DATE SELECTION


dateSelect : Date -> (Date -> msg) -> Html msg
dateSelect date changeDate =
    div [ class "ui secondary menu" ]
        [ div [ class "ui horizontally fitted simple dropdown item" ]
            [ div [] [ text (Date.format "MMMM" date) ]
            , Html.i [ class "dropdown icon" ] []
            , div [ class "menu", style "margin" "0" ]
                (listMonths date changeDate)
            ]
        , div [ class "ui simple dropdown item" ]
            [ div [] [ text (Date.format "yyyy" date) ]
            , Html.i [ class "dropdown icon" ] []
            , div [ class "menu", style "margin" "0" ]
                (listYears date changeDate)
            ]
        , a [ class "item", href (Link.toCalendar Nothing) ]
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
    div [ class "item", onClick (changeDate date) ] [ text <| Date.format formatDate date ]



-- CALENDAR VIEW


viewWeek : Date -> Html msg
viewWeek start =
    let
        days =
            daysOfWeek start
    in
    div [ class "equal width row" ] <|
        titleWeek start
            :: List.map viewDay days


viewDay : Date -> Html msg
viewDay date =
    div [ class "column" ]
        [ a [ class "ui small circular label", href (Link.toBlockList (Just date)) ]
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
                |> Maybe.map (Date.format "MMMM")
                |> Maybe.withDefault ""
    in
    div [ class "left floated three wide column" ]
        [ text monthStart
        ]


weekList : Date -> List Date
weekList date =
    let
        start =
            Date.floor Week date

        end =
            Date.add Months 3 start
    in
    Date.range Week 1 start end


daysOfWeek : Date -> List Date
daysOfWeek start =
    Date.range Day 1 start (Date.add Weeks 1 start)

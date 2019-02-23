module Calendar exposing (Model, view)

import Date exposing (Date, Interval(..), Unit(..))
import Html exposing (Html, a, button, div, text)
import Html.Attributes exposing (class, href, id, style)
import Html.Events exposing (onClick)
import Link
import Time exposing (Month(..))


type alias Model =
    { date : Date
    }


view : (Date -> msg) -> Model -> Html msg
view changeDate { date } =
    div
        [ class "column grow"
        , id "calendar"
        , style "overflow" "scroll"
        ]
        (dateSelect date changeDate
            :: (weekList date |> List.map viewWeek)
        )



-- DATE SELECTION


dateSelect : Date -> (Date -> msg) -> Html msg
dateSelect date changeDate =
    div
        [ class "row"
        , style "position" "sticky"
        , style "top" "0"
        , style "background-color" "white"
        ]
        [ div [ class "dropdown" ]
            [ button [ class "menu-button" ]
                [ text (Date.format "MMMM" date)
                , text " ▿"
                ]
            , div [ class "dropdown-content" ]
                (listMonths date changeDate)
            ]
        , div [ class "dropdown", style "margin-left" "0.5em" ]
            [ button [ class "menu-button" ]
                [ text (Date.format "yyyy" date)
                , text " ▿"
                ]
            , div [ class "dropdown-content" ]
                (listYears date changeDate)
            ]
        , a
            [ class "menu-button"
            , style "margin-left" "1em"
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
    div [ class "row", style "min-height" "3em" ] <|
        titleWeek start
            :: List.map viewDay days


viewDay : Date -> Html msg
viewDay date =
    div [ style "flex-basis" "12%" ]
        [ a [ href (Link.toBlockList (Just date)) ]
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
    div [ style "flex-basis" "16%" ]
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

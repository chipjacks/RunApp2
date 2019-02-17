module Calendar exposing (view)

import Date exposing (Date, Interval(..), Unit(..))
import Html exposing (Html, a, div, text)
import Html.Attributes exposing (class, href, id, style)
import Link
import Time exposing (Month(..))


view : Date -> Html.Attribute msg -> Html msg
view date onScroll =
    div
        [ class "column no-grow"
        , id "calendar"
        , onScroll
        ]
        [ div [ class "column grow" ] (weekList date |> List.map viewWeek) ]


viewWeek : Date -> Html msg
viewWeek start =
    let
        days =
            daysOfWeek start
    in
    div [ class "row grow", style "min-height" "50px" ] <|
        titleWeek start
            :: List.map viewDay days


viewDay : Date -> Html msg
viewDay date =
    div [ class "column" ]
        [ a [ href (Link.toBlockList date) ]
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

        yearStart =
            daysOfWeek start
                |> List.filter (\d -> Date.ordinalDay d == 1)
                |> List.head
                |> Maybe.map (Date.format "yyyy")
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
            Date.add Months 4 start
    in
    Date.range Week 1 start end


daysOfWeek : Date -> List Date
daysOfWeek start =
    Date.range Day 1 start (Date.add Weeks 1 start)

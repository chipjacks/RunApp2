module Calendar exposing (view)

import Date exposing (Date, Interval(..), Unit(..))
import Element exposing (Element, above, alignBottom, column, el, fill, link, px, row, spaceEvenly, text, width)
import Link
import Time exposing (Month(..))


view : Date -> Element msg
view date =
    column []
        (weekList date |> List.map viewWeek)


viewWeek : Date -> Element msg
viewWeek start =
    let
        days =
            daysOfWeek start
    in
    row [ spaceEvenly, width fill ] <|
        titleWeek start
            :: List.map viewDay days


viewDay : Date -> Element msg
viewDay date =
    link []
        { url = Link.toBlockList { date = Date.toRataDie date }
        , label = Date.format "d" date |> text
        }


titleWeek : Date -> Element msg
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
    el
        [ width (px 100)
        , above (text yearStart)
        ]
        (text monthStart)


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

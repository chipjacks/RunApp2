module Calendar exposing (Model, Msg, initCmd, update, urlParser, view)

import Date exposing (Date, Interval(..), Unit(..))
import Element exposing (Element, above, alignBottom, column, el, fill, link, px, row, spaceEvenly, text, width)
import Html exposing (Html)
import Link
import Task exposing (Task)
import Time exposing (Month(..))
import Url.Parser.Query as Query


type Model
    = Loading
    | Problem String
    | Loaded Date


type Msg
    = ReceiveDate Date


urlParser : Query.Parser Model
urlParser =
    Query.map
        parseDate
        (Query.int "date")


initCmd : Model -> Cmd Msg
initCmd model =
    case model of
        Loading ->
            Date.today |> Task.perform ReceiveDate

        _ ->
            Cmd.none


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ReceiveDate date ->
            ( Loaded date, Cmd.none )


view : Model -> Html Msg
view model =
    Element.layout [] <|
        case model of
            Loaded date ->
                viewLoaded date

            Loading ->
                el [] (text "Loading Calendar")

            Problem message ->
                el [] (text message)



-- INTERNAL


parseDate : Maybe Int -> Model
parseDate rataDie =
    case rataDie of
        Just int ->
            Loaded (Date.fromRataDie int)

        Nothing ->
            Loading


viewLoaded : Date -> Element Msg
viewLoaded date =
    column []
        (weekList date |> List.map viewWeek)


viewWeek : Date -> Element Msg
viewWeek start =
    let
        days =
            daysOfWeek start
    in
    row [ spaceEvenly, width fill, alignBottom ] <|
        titleWeek start
            :: (days
                    |> List.map (\day -> Date.format "d" day |> text)
               )


titleWeek : Date -> Element Msg
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

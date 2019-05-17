module Calendar exposing (Model(..), resetScroll, view)

import Activity exposing (Activity)
import ActivityShape
import Browser.Dom as Dom
import Date exposing (Date, Interval(..), Unit(..))
import Html exposing (Html, a, button, div, text)
import Html.Attributes exposing (attribute, class, href, id, style)
import Html.Events exposing (on, onClick)
import Json.Decode as Decode
import Link
import Skeleton exposing (column, expandingRow, row, twoColumns)
import Task
import Time exposing (Month(..))


type Model
    = Weekly
    | Daily


view : (Date -> msg) -> (Date -> List Activity) -> Date -> Model -> Html msg
view changeDate accessActivities date model =
    let
        body =
            case model of
                Weekly ->
                    weekList date |> List.map viewWeek

                Daily ->
                    listDays date
                        |> List.map (\d -> ( d, accessActivities d ))
                        |> List.map viewDay
    in
    column
        [ id "calendar"
        , style "overflow" "scroll"
        , attribute "data-date" (Date.toIsoString date)
        , onScroll <| scrollHandler date changeDate model
        ]
        [ column [ style "margin-bottom" scrollConfig.marginBottom ]
            body
        ]



-- SCROLLING


scrollConfig =
    { marginBottom = "-500px"
    , center = 250
    , loadPrevious = 10
    , loadNext = 490
    }


onScroll : (Int -> msg) -> Html.Attribute msg
onScroll msg =
    Html.Events.on "scroll"
        (Decode.at [ "target", "scrollTop" ] Decode.int
            |> Decode.map msg
        )


resetScroll : msg -> Cmd msg
resetScroll msg =
    Task.attempt
        (\_ -> msg)
        (Dom.setViewportOf "calendar" 0 scrollConfig.center)


scrollHandler : Date -> (Date -> msg) -> Model -> (Int -> msg)
scrollHandler date changeDate model =
    case model of
        Weekly ->
            \scrollTop ->
                if scrollTop < scrollConfig.loadPrevious then
                    changeDate (Date.add Weeks -4 date)

                else if scrollTop > scrollConfig.loadNext then
                    changeDate (Date.add Weeks 4 date)

                else
                    changeDate date

        Daily ->
            \scrollTop ->
                if scrollTop < scrollConfig.loadPrevious then
                    changeDate (Date.add Days -3 date)

                else if scrollTop > scrollConfig.loadNext then
                    changeDate (Date.add Days 3 date)

                else
                    changeDate date



-- WEEKLY VIEW


viewWeek : Date -> Html msg
viewWeek start =
    let
        days =
            daysOfWeek start
    in
    expandingRow [ style "min-height" "3rem" ] <|
        titleWeek start
            :: List.map viewWeekDay days


viewWeekDay : Date -> Html msg
viewWeekDay date =
    column []
        [ a
            [ href (Link.toCalendarDate date)
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



-- DAILY VIEW


viewDay : ( Date, List Activity ) -> Html msg
viewDay ( date, activities ) =
    expandingRow []
        [ column []
            [ expandingRow [ style "margin-top" "1rem", style "margin-bottom" "1rem" ]
                [ text (Date.format "E MMM d" date)
                , a [ href (Link.toNewActivity date) ] [ text "+" ]
                ]
            , expandingRow []
                [ viewActivities activities ]
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


viewActivities : List Activity -> Html msg
viewActivities activities =
    column [] (List.map viewActivity activities)


viewActivity : Activity -> Html msg
viewActivity activity =
    a [ href (Link.toActivity activity.id) ]
        [ expandingRow [ style "margin-bottom" "1rem" ] <|
            twoColumns
                [ ActivityShape.view activity.details ]
                [ text activity.description ]
        ]

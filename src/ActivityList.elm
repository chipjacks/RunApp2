module ActivityList exposing (handleScroll, view)

import Activity exposing (Activity)
import ActivityShape
import Date exposing (Date, Interval(..), Unit(..))
import Html exposing (Html, a, div, text)
import Html.Attributes exposing (attribute, class, href, id, style)
import Html.Events exposing (onClick)
import Link
import Scroll
import Skeleton exposing (column, expandingRow, row, twoColumns)


view : List Activity -> (Activity -> msg) -> (Int -> msg) -> Date -> Html msg
view activities editActivity scrollMsg date =
    column [ style "flex-grow" "1", style "border-right" "1px solid #f1f1f1" ]
        [ header date
        , scrollingBody activities editActivity scrollMsg date
        ]


header : Date -> Html msg
header date =
    row [] [ text (Date.toIsoString date) ]


scrollingBody : List Activity -> (Activity -> msg) -> (Int -> msg) -> Date -> Html msg
scrollingBody activities editActivity scrollMsg date =
    column
        [ id "activities"
        , style "overflow" "scroll"
        , attribute "data-date" (Date.toIsoString date)
        , Scroll.on scrollMsg
        ]
        [ column [ style "margin-bottom" Scroll.config.marginBottom ]
            (listDays date
                |> List.map (\d -> ( d, List.filter (\a -> a.date == d) activities ))
                |> List.map (viewDay editActivity)
            )
        ]


handleScroll : Int -> (Int -> msg) -> ( Date -> Date, Cmd msg )
handleScroll scrollTop scrollMsg =
    if scrollTop < Scroll.config.loadPrevious then
        ( Date.add Days -3, Scroll.reset scrollMsg "activities" )

    else if scrollTop > Scroll.config.loadNext then
        ( Date.add Days 3, Scroll.reset scrollMsg "activities" )

    else
        ( identity, Cmd.none )


viewDay : (Activity -> msg) -> ( Date, List Activity ) -> Html msg
viewDay editActivity ( date, activities ) =
    expandingRow []
        [ column []
            [ expandingRow [ style "margin-top" "1rem", style "margin-bottom" "1rem" ]
                [ a [ href (Link.toCalendar (Just date)) ]
                    [ text (Date.format "E MMM d" date) ]
                ]
            , expandingRow []
                [ viewActivities activities editActivity ]
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


viewActivities : List Activity -> (Activity -> msg) -> Html msg
viewActivities activities editActivity =
    column [] (List.map (viewActivity editActivity) activities)


viewActivity : (Activity -> msg) -> Activity -> Html msg
viewActivity editActivity activity =
    a [ href (Link.toActivity <| Just activity.id) ]
        [ expandingRow [ style "margin-bottom" "1rem" ] <|
            twoColumns
                [ ActivityShape.view activity.details ]
                [ text activity.description ]
        ]

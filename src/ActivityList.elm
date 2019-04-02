module ActivityList exposing (handleScroll, view)

import Activity exposing (Activity)
import Date exposing (Date, Interval(..), Unit(..))
import Html exposing (Html, a, div, text)
import Html.Attributes exposing (attribute, class, href, id, style)
import Html.Events exposing (onClick)
import Link
import Scroll


view : Maybe (List Activity) -> (Activity -> msg) -> (Int -> msg) -> Date -> Html msg
view activitiesM editActivity scrollMsg date =
    div [ class "column" ]
        [ header date
        , scrollingBody activitiesM editActivity scrollMsg date
        ]


header : Date -> Html msg
header date =
    div [ class "row no-grow" ] [ text (Date.toIsoString date) ]


scrollingBody : Maybe (List Activity) -> (Activity -> msg) -> (Int -> msg) -> Date -> Html msg
scrollingBody activitiesM editActivity scrollMsg date =
    div
        [ class "column"
        , id "activities"
        , style "overflow" "scroll"
        , attribute "data-date" (Date.toIsoString date)
        , Scroll.on scrollMsg
        ]
        [ div [ class "column", style "margin-bottom" Scroll.config.marginBottom ]
            (listDays date
                |> List.map (\d -> ( d, List.filter (\a -> a.date == d) (Maybe.withDefault [] activitiesM) ))
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
    div [ class "row" ]
        [ div [ class "column" ]
            [ div [ class "row" ]
                [ a [ href (Link.toCalendar (Just date)) ]
                    [ text (Date.format "E MMM d" date) ]
                ]
            , div [ class "row" ]
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
    div [ class "column" ]
        (List.map
            (\a ->
                div [ class "row", onClick (editActivity a) ] [ text a.description ]
            )
            activities
        )

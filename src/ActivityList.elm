module ActivityList exposing (view)

import Activity exposing (Activity)
import Date exposing (Date, Interval(..), Unit(..))
import Html exposing (Html, a, div, text)
import Html.Attributes exposing (class, href, id)
import Html.Events exposing (onClick)
import Link


view : Maybe (List Activity) -> (Activity -> msg) -> Date -> Html msg
view activitiesM editActivity date =
    div [ class "column grow", id "activities" ]
        [ text ("Activities " ++ Date.toIsoString date)
        , div [ class "column grow" ]
            (dayList date
                |> List.map (\d -> ( d, List.filter (\a -> a.date == d) (Maybe.withDefault [] activitiesM) ))
                |> List.map (viewDay editActivity)
            )
        ]


viewDay : (Activity -> msg) -> ( Date, List Activity ) -> Html msg
viewDay editActivity ( date, activities ) =
    div [ class "row" ]
        [ a [ href (Link.toCalendar (Just date)) ]
            [ text (Date.format "E" date) ]
        , viewActivities activities editActivity
        ]


dayList : Date -> List Date
dayList date =
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

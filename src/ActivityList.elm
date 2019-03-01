module ActivityList exposing (view)

import Activity exposing (Activity)
import Date exposing (Date)
import Html exposing (Html, a, div, text)
import Html.Attributes exposing (class, href, id)
import Html.Events exposing (onClick)
import Link


view : Maybe (List Activity) -> (Activity -> msg) -> Date -> Html msg
view activitiesM editActivity date =
    div [ class "column grow", id "activities" ]
        [ text ("Activities " ++ Date.toIsoString date)
        , a [ href (Link.toCalendar (Just date)) ]
            [ text "Calendar" ]
        , viewActivities activitiesM editActivity
        ]


viewActivities : Maybe (List Activity) -> (Activity -> msg) -> Html msg
viewActivities activitiesM editActivity =
    case activitiesM of
        Just activities ->
            div [ class "column" ]
                (List.map
                    (\a ->
                        div [ class "row", onClick (editActivity a) ] [ text a.description ]
                    )
                    activities
                )

        Nothing ->
            div [] [ text "Loading activities" ]

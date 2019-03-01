module ActivityList exposing (view)

import Activity exposing (Activity)
import Date exposing (Date)
import Html exposing (Html, a, div, text)
import Html.Attributes exposing (class, href, id)
import Link


view : Maybe (List Activity) -> Date -> Html msg
view activitiesM date =
    div [ class "column grow", id "activities" ]
        [ text ("Activities " ++ Date.toIsoString date)
        , a [ href (Link.toCalendar (Just date)) ]
            [ text "Calendar" ]
        , viewActivities activitiesM
        ]


viewActivities : Maybe (List Activity) -> Html msg
viewActivities activitiesM =
    case activitiesM of
        Just activities ->
            div [ class "column" ]
                (List.map
                    (\a ->
                        div [ class "row" ] [ text a.description ]
                    )
                    activities
                )

        Nothing ->
            div [] [ text "Loading activities" ]

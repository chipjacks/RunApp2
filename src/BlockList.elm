module BlockList exposing (Model, view)

import Activities exposing (Activity, WebData(..))
import Date exposing (Date)
import Html exposing (Html, a, button, div, input, text)
import Html.Attributes exposing (class, href, id, placeholder, type_)
import Html.Events exposing (onClick, onInput)
import Link


type alias Model =
    { date : Date
    }


view : Activities.Model -> (Activities.Msg -> msg) -> Model -> Html msg
view activities parentMsg { date } =
    div [ class "column grow", id "blocks" ]
        [ text ("Blocks " ++ Date.toIsoString date)
        , a [ href (Link.toCalendar (Just date)) ]
            [ text "Calendar" ]
        , viewActivities activities.fetching
        ]


viewActivities : WebData (List Activity) -> Html msg
viewActivities activitiesWD =
    case activitiesWD of
        Success activities ->
            div [ class "column" ]
                (List.map
                    (\a ->
                        div [ class "row" ] [ text a.description ]
                    )
                    activities
                )

        Loading ->
            div [] [ text "Loading activities" ]

        Failure e ->
            div [] [ text "Activities failed to load" ]

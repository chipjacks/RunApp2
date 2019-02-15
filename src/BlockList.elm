module BlockList exposing (view)

import Date exposing (Date)
import Html exposing (Html, a, div, text)
import Html.Attributes exposing (class, href, id)
import Link


view : Date -> Html msg
view date =
    div [ class "column", id "blocks" ]
        [ text ("Blocks " ++ Date.toIsoString date)
        , a [ href (Link.toCalendar date) ]
            [ text "Calendar" ]
        ]

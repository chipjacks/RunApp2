module Skeleton exposing (layout)

import Html exposing (Html, div, text)
import Html.Attributes exposing (class, style)


layout : Html msg -> Html msg
layout page =
    div [ class "container column" ]
        [ div [ class "row no-grow", style "justify-content" "center" ] [ text "HEADER" ]
        , page
        , div [ class "row no-grow", style "justify-content" "center" ] [ text "FOOTER" ]
        ]

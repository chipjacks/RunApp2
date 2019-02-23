module Skeleton exposing (layout)

import Html exposing (Html, div, text)
import Html.Attributes exposing (class, style)



{-
   TODO: use the off-canvas pattern for responsiveness
   https://developers.google.com/web/fundamentals/design-and-ux/responsive/patterns#off_canvas
-}


layout : Html msg -> Html msg
layout page =
    div [ class "container column" ]
        [ div [ class "row", style "justify-content" "center" ] [ text "HEADER" ]
        , page
        , div [ class "row", style "justify-content" "center" ] [ text "FOOTER" ]
        ]

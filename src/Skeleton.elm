module Skeleton exposing (layout)

import Config exposing (config)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)



{-
   TODO: use the off-canvas pattern for responsiveness
   https://developers.google.com/web/fundamentals/design-and-ux/responsive/patterns#off_canvas
-}


layout : Html msg -> Html msg
layout body =
    div [ class "ui container" ]
        [ div [ class "ui menu" ]
            [ div [ class "header item" ]
                [ text "HEADER" ]
            ]
        , body
        ]

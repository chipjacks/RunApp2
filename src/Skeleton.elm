module Skeleton exposing (layout)

import Config exposing (config)
import Element exposing (Element, centerX, column, el, fill, height, maximum, minimum, px, row, text, width)
import Html exposing (Html)



{-
   TODO: use the off-canvas pattern for responsiveness
   https://developers.google.com/web/fundamentals/design-and-ux/responsive/patterns#off_canvas
-}


layout : Element msg -> Html msg
layout body =
    Element.layout [ width fill, centerX ]
        (column [ centerX, width (fill |> maximum config.maxWindowWidth |> minimum config.minColumnWidth) ]
            [ el [ centerX ] (text "HEADER")
            , body
            , el [ centerX ] (text "FOOTER")
            ]
        )

module Skeleton exposing (layout)

import Element exposing (Element, centerX, fill, height, px, row, width)
import Html exposing (Html)



{-
   TODO: use the off-canvas pattern for responsiveness
   https://developers.google.com/web/fundamentals/design-and-ux/responsive/patterns#off_canvas
-}


layout : Element msg -> Html msg
layout body =
    Element.layout [ width fill, Element.explain Debug.todo ]
        (row [ centerX, width (px 320), height (px 568) ] [ body ])

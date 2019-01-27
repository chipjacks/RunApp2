module Skeleton exposing (layout)

import Browser
import Element exposing (Element, centerX, fill, row, width)
import Html exposing (Html)



{-

   DESKTOP
   calendar    list    library

   TABLET
   calendar    list    <->   list        library

   PHONE PORTRAIT
   calendar <-> list <-> library

   PHONE LANDSCAPE
   calendar    list <->  list  library

-}


layout : Element msg -> Html msg
layout body =
    Element.layout [ width fill, Element.explain Debug.todo ]
        (row [ centerX ] [ body ])

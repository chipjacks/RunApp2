module OffCanvasLayout exposing (Focus(..), view)

import Config exposing (config)
import Element exposing (Element, el, fill, width)
import Window exposing (Window)



{-
   Uses the [off-canvas](https://developers.google.com/web/fundamentals/design-and-ux/responsive/patterns#off_canvas)
   pattern for responsiveness.

-}


type alias OffCanvasLayout msg =
    { visible : Visible
    , focus : Focus
    , col1 : Element msg
    , col2 : Element msg
    , col3 : Element msg
    }


type Visible
    = AllThree
    | FirstTwo
    | LastTwo
    | FirstOne
    | SecondOne
    | ThirdOne


type Focus
    = First
    | Second
    | Third


view : Window -> Focus -> Element msg -> Element msg -> Element msg -> Element msg
view window focus col1 col2 col3 =
    let
        layout =
            resize window (OffCanvasLayout AllThree focus col1 col2 col3)
    in
    case layout.visible of
        AllThree ->
            Element.row [ width fill ]
                [ col1
                , col2
                , col3
                ]

        FirstTwo ->
            Element.row [ width fill ]
                [ col1
                , col2
                ]

        LastTwo ->
            Element.row [ width fill ]
                [ col2
                , col3
                ]

        FirstOne ->
            Element.row [ width fill ]
                [ col1
                ]

        SecondOne ->
            Element.row [ width fill ]
                [ col2
                ]

        ThirdOne ->
            Element.row [ width fill ]
                [ col3
                ]



-- INTERNAL


resize : Window -> OffCanvasLayout msg -> OffCanvasLayout msg
resize window layout =
    if window.width < (config.minColumnWidth * 2) then
        { layout | visible = zoomOne layout.focus }

    else if window.width < (config.minColumnWidth * 3) then
        { layout | visible = zoomTwo layout.focus layout.visible }

    else
        { layout | visible = AllThree }


zoomOne : Focus -> Visible
zoomOne focus =
    case focus of
        First ->
            FirstOne

        Second ->
            SecondOne

        Third ->
            ThirdOne


zoomTwo : Focus -> Visible -> Visible
zoomTwo focus visible =
    case ( focus, visible ) of
        ( First, _ ) ->
            FirstTwo

        ( Second, FirstTwo ) ->
            FirstTwo

        ( Second, LastTwo ) ->
            LastTwo

        ( Second, _ ) ->
            FirstTwo

        ( Third, _ ) ->
            LastTwo

module OffCanvasLayout exposing (Focus(..), view)

import Element exposing (Device, DeviceClass(..), Element, Orientation(..), el)



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


view : Device -> Focus -> Element msg -> Element msg -> Element msg -> Element msg
view device focus col1 col2 col3 =
    let
        layout =
            resize device (OffCanvasLayout AllThree focus col1 col2 col3)
    in
    case layout.visible of
        AllThree ->
            Element.row []
                [ col1
                , col2
                , col3
                ]

        FirstTwo ->
            Element.row []
                [ col1
                , col2
                ]

        LastTwo ->
            Element.row []
                [ col2
                , col3
                ]

        FirstOne ->
            Element.row []
                [ col1
                ]

        SecondOne ->
            Element.row []
                [ col2
                ]

        ThirdOne ->
            Element.row []
                [ col3
                ]



-- INTERNAL


resize : Device -> OffCanvasLayout msg -> OffCanvasLayout msg
resize device layout =
    case ( device.class, device.orientation ) of
        ( Phone, Portrait ) ->
            { layout | visible = zoomOne layout.focus }

        ( Phone, Landscape ) ->
            { layout | visible = zoomTwo layout.focus layout.visible }

        ( Tablet, Portrait ) ->
            { layout | visible = zoomTwo layout.focus layout.visible }

        _ ->
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

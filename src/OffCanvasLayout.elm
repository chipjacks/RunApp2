module OffCanvasLayout exposing (Focus(..), view)

import Config exposing (config)
import Html exposing (Html, div)
import Html.Attributes exposing (class, style)
import Window exposing (Window)



{-
   Uses the [off-canvas](https://developers.google.com/web/fundamentals/design-and-ux/responsive/patterns#off_canvas)
   pattern for responsiveness.

-}


type alias OffCanvasLayout msg =
    { visible : Visible
    , focus : Focus
    , col1 : Html msg
    , col2 : Html msg
    , col3 : Html msg
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


view : Window -> Focus -> Html msg -> Html msg -> Html msg -> List (Html msg)
view window focus col1 col2 col3 =
    let
        layout =
            resize window (OffCanvasLayout AllThree focus col1 col2 col3)
    in
    case layout.visible of
        AllThree ->
            [ col1
            , col2
            , col3
            ]

        FirstTwo ->
            [ col1
            , col2
            ]

        LastTwo ->
            [ col2
            , col3
            ]

        FirstOne ->
            [ col1
            ]

        SecondOne ->
            [ col2
            ]

        ThirdOne ->
            [ col3
            ]



-- INTERNAL


resize : Window -> OffCanvasLayout msg -> OffCanvasLayout msg
resize window layout =
    if window.width < (config.window.minWidth * 2 + 20) then
        { layout | visible = zoomOne layout.focus }

    else if window.width < (config.window.minWidth * 3 + 40) then
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

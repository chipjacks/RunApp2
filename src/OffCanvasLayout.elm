module OffCanvasLayout exposing (Focus(..), OffCanvasLayout, Visible(..), changeFocus, resize)

import Element exposing (Device, DeviceClass(..), Element, Orientation(..), el)



{-
   TODO: use the off-canvas pattern for responsiveness
   https://developers.google.com/web/fundamentals/design-and-ux/responsive/patterns#off_canvas
-}


type alias OffCanvasLayout msg =
    { visible : Visible
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



-- init |> resize |> changeFocus


init : Element msg -> Element msg -> Element msg -> OffCanvasLayout msg
init col1 col2 col3 =
    OffCanvasLayout AllThree col1 col2 col3


{-|

    import Element

    changeFocus First (OffCanvasLayout LastTwo Element.none Element.none Element.none)
    --> OffCanvasLayout FirstTwo Element.none Element.none Element.none

-}
changeFocus : Focus -> OffCanvasLayout msg -> OffCanvasLayout msg
changeFocus focus layout =
    { layout | visible = updateVisible focus layout.visible }


{-|

    import Element exposing (Device, DeviceClass(..), Orientation(..))

    resize (Device Phone Portrait) (OffCanvasLayout LastTwo Element.none Element.none Element.none)
    --> OffCanvasLayout SecondOne Element.none Element.none Element.none

-}
resize : Device -> OffCanvasLayout msg -> OffCanvasLayout msg
resize device layout =
    case ( device.class, device.orientation ) of
        ( Phone, Portrait ) ->
            layout

        _ ->
            layout


view : OffCanvasLayout msg -> Element msg
view a =
    Element.none



-- INTERNAL


updateVisible : Focus -> Visible -> Visible
updateVisible focus visible =
    case focus of
        First ->
            case visible of
                LastTwo ->
                    FirstTwo

                SecondOne ->
                    FirstOne

                ThirdOne ->
                    FirstOne

                _ ->
                    visible

        Second ->
            case visible of
                FirstOne ->
                    SecondOne

                ThirdOne ->
                    SecondOne

                _ ->
                    visible

        Third ->
            case visible of
                FirstTwo ->
                    LastTwo

                SecondOne ->
                    ThirdOne

                FirstOne ->
                    ThirdOne

                _ ->
                    visible

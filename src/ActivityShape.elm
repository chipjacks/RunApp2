module ActivityShape exposing (view, viewDefault)

import Activity exposing (Details(..), Interval(..), Pace(..))
import Html exposing (Html, div)
import Html.Attributes exposing (class, style)
import Svg exposing (circle, svg)
import Svg.Attributes exposing (cx, cy, fill, height, r, width)


type Shape
    = Block Color { width : Int, height : Int }
    | Circle Color


type Color
    = Green


view : Details -> Html msg
view details =
    case details of
        Run (Interval duration pace) ->
            Block Green { width = toWidth pace, height = toHeight duration }
                |> viewShape

        Intervals intervals ->
            Circle Green
                |> viewShape

        Other duration ->
            Circle Green
                |> viewShape


viewDefault : Html msg
viewDefault =
    Circle Green |> viewShape


viewShape : Shape -> Html msg
viewShape shape =
    case shape of
        Block color { width, height } ->
            div [ class "row no-grow" ]
                [ div
                    [ style "width" <| String.fromInt width ++ "%"
                    , style "height" <| String.fromInt height ++ "em"
                    , style "background-color" (colorString color)
                    ]
                    []
                ]

        Circle color ->
            div [ class "row no-grow" ]
                [ svg [ width "30", height "30" ] [ circle [ cx "15", cy "15", r "10", fill (colorString color) ] [] ]
                ]


colorString : Color -> String
colorString color =
    case color of
        Green ->
            "lightgreen"


toHeight : Activity.Minutes -> Int
toHeight duration =
    duration // 10


toWidth : Activity.Pace -> Int
toWidth pace =
    case pace of
        Easy ->
            10

        Moderate ->
            20

        SteadyState ->
            30

        Brisk ->
            40

        AerobicThreshold ->
            50

        LactateThreshold ->
            60

        Groove ->
            70

        VO2Max ->
            80

        Fast ->
            90

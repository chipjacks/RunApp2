module ActivityShape exposing (view, viewDefault)

import Activity exposing (Details(..), Interval(..), Pace(..))
import Html exposing (Html, div)
import Html.Attributes exposing (class, style)
import Svg exposing (circle, svg)
import Svg.Attributes exposing (cx, cy, fill, height, r, width)


type Shape
    = Block Color { width : Int, height : Float }
    | Circle Color { height : Float }


type Color
    = Green
    | Grey


view : Details -> Html msg
view details =
    case details of
        Run (Interval duration pace) ->
            Block Green { width = toWidth pace, height = toHeight duration }
                |> viewShape

        Intervals intervals ->
            div [ class "column" ] <|
                List.map
                    (\(Interval duration pace) -> Block Green { width = toWidth pace, height = toHeight duration } |> viewShape)
                    intervals

        Other duration ->
            Circle Grey { height = toHeight duration }
                |> viewShape


viewDefault : Html msg
viewDefault =
    Circle Grey { height = 1 } |> viewShape


viewShape : Shape -> Html msg
viewShape shape =
    case shape of
        Block color { width, height } ->
            div [ class "row no-grow" ]
                [ div
                    [ style "width" <| String.fromInt width ++ "%"
                    , style "height" <| String.fromFloat height ++ "em"
                    , style "background-color" (colorString color)
                    ]
                    []
                ]

        Circle color { height } ->
            div [ class "row no-grow" ]
                [ div
                    [ style "width" "1em"
                    , style "height" <| String.fromFloat height ++ "em"
                    , style "background-color" (colorString color)
                    , style "border-radius" "0.5em"
                    ]
                    []
                ]


colorString : Color -> String
colorString color =
    case color of
        Green ->
            "limegreen"

        Grey ->
            "gray"


toHeight : Activity.Minutes -> Float
toHeight duration =
    toFloat duration / 10


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

module ActivityShape exposing (view, viewDefault)

import Activity exposing (Details(..), Interval(..), Pace(..))
import Html exposing (Html, div)
import Html.Attributes exposing (class, style)
import Skeleton exposing (column, row)
import Svg exposing (circle, svg)
import Svg.Attributes exposing (cx, cy, fill, height, r, width)


type Shape
    = Block Color { width : Float, height : Float }
    | Circle Color { height : Float }


type Color
    = Green
    | Gray


view : Details -> Html msg
view details =
    case details of
        Run (Interval duration pace) ->
            Block Green { width = toWidth pace, height = toHeight duration }
                |> viewShape

        Intervals intervals ->
            column [] <|
                List.map
                    (\(Interval duration pace) -> Block Green { width = toWidth pace, height = toHeight duration } |> viewShape)
                    intervals

        Other duration ->
            Circle Gray { height = toHeight duration }
                |> viewShape


viewDefault : Html msg
viewDefault =
    Circle Gray { height = 1 } |> viewShape


viewShape : Shape -> Html msg
viewShape shape =
    case shape of
        Block color { width, height } ->
            div
                [ style "width" <| String.fromFloat (width * 0.5) ++ "rem"
                , style "height" <| String.fromFloat height ++ "rem"
                , style "background-color" (colorString color)
                ]
                []

        Circle color { height } ->
            div
                [ style "width" "0.5rem"
                , style "height" <| String.fromFloat height ++ "rem"
                , style "background-color" (colorString color)
                , style "border-radius" "0.25rem"
                ]
                []


colorString : Color -> String
colorString color =
    case color of
        Green ->
            "limegreen"

        Gray ->
            "gray"


toHeight : Activity.Minutes -> Float
toHeight duration =
    toFloat duration / 10


toWidth : Activity.Pace -> Float
toWidth pace =
    case pace of
        Easy ->
            1

        Moderate ->
            2

        SteadyState ->
            3

        Brisk ->
            4

        AerobicThreshold ->
            5

        LactateThreshold ->
            6

        Groove ->
            7

        VO2Max ->
            8

        Fast ->
            9

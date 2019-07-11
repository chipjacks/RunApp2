module ActivityShape exposing (view, viewDefault)

import Activity exposing (Details(..), Pace(..))
import Html exposing (Html, div)
import Html.Attributes exposing (class, style)
import Skeleton exposing (column, row)


type Shape
    = Block Color Bool { width : Float, height : Float }
    | Circle Color Bool


type Color
    = Green
    | Gray


view : Bool -> Details -> Html msg
view completed details =
    case details of
        Run duration pace ->
            Block Green completed { width = toWidth pace, height = toHeight duration }
                |> viewShape

        Other duration ->
            Circle Gray completed
                |> viewShape


viewDefault : Html msg
viewDefault =
    Circle Gray False |> viewShape


viewShape : Shape -> Html msg
viewShape shape =
    case shape of
        Block color completed { width, height } ->
            div
                [ style "width" <| String.fromFloat (width * 0.5) ++ "rem"
                , style "height" <| String.fromFloat height ++ "rem"
                , style "border" ("2px solid " ++ colorString color)
                , if completed then
                    style "background-color" (colorString color)

                  else
                    style "background-color" "white"
                ]
                []

        Circle color completed ->
            div
                [ style "width" "1rem"
                , style "height" "1rem"
                , style "border-radius" "0.6rem"
                , style "border" ("2px solid " ++ colorString color)
                , if completed then
                    style "background-color" (colorString color)

                  else
                    style "background-color" "white"
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

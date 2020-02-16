module ActivityShape exposing (view, viewDefault)

import Activity exposing (Activity, Pace(..), activityType)
import Html exposing (Html, div)
import Html.Attributes exposing (class, style)
import Skeleton exposing (column, row)


type Shape
    = Block Color Bool { width : Float, height : Float }
    | Circle Color Bool (Maybe Char)


type Color
    = Green
    | Orange
    | Gray


view : Activity -> Html msg
view activity =
    case activityType activity of
        Activity.Run ->
            Block Green activity.completed { width = toWidth (Maybe.withDefault Activity.Easy activity.pace), height = toHeight activity.duration }
                |> viewShape

        Activity.Race ->
            Block Orange activity.completed { width = toWidth (Maybe.withDefault Activity.Lactate activity.pace), height = toHeight activity.duration }
                |> viewShape

        Activity.Other ->
            Circle Gray activity.completed (String.toList activity.description |> List.head)
                |> viewShape


viewDefault : Bool -> Activity.ActivityType -> Html msg
viewDefault completed activityType =
    case activityType of
        Activity.Run ->
            Block Green completed { width = 2, height = 1 }
                |> viewShape

        Activity.Race ->
            Block Orange completed { width = 2, height = 1 }
                |> viewShape

        Activity.Other ->
            Circle Gray completed Nothing
                |> viewShape


viewShape : Shape -> Html msg
viewShape shape =
    case shape of
        Block color completed { width, height } ->
            div
                [ style "width" <| String.fromFloat (width * 0.5) ++ "rem"
                , style "height" <| String.fromFloat height ++ "rem"
                , style "border" ("2px solid " ++ colorString color)
                , style "border-radius" "2px"
                , if completed then
                    style "background-color" (colorString color)

                  else
                    style "background-color" "white"
                ]
                []

        Circle color completed charM ->
            let
                ( backgroundColor, textColor ) =
                    if completed then
                        ( colorString color, "white" )

                    else
                        ( "white", colorString color )
            in
            div
                [ style "width" "1rem"
                , style "height" "1rem"
                , style "border-radius" "50%"
                , style "border" ("2px solid " ++ colorString color)
                , style "text-align" "center"
                , style "font-size" "0.8rem"
                , style "background-color" backgroundColor
                , style "color" textColor
                ]
                [ Html.text (charM |> Maybe.map Char.toUpper |> Maybe.map String.fromChar |> Maybe.withDefault "") ]


colorString : Color -> String
colorString color =
    case color of
        Green ->
            "limegreen"

        Orange ->
            "orange"

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

        Steady ->
            3

        Brisk ->
            4

        Aerobic ->
            5

        Lactate ->
            6

        Groove ->
            7

        VO2 ->
            8

        Fast ->
            9

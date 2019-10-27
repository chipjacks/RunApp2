module ActivityShape exposing (view, viewDefault)

import Activity exposing (Activity, Pace(..), activityType)
import Html exposing (Html, div)
import Html.Attributes exposing (class, style)
import Skeleton exposing (column, row)


type Shape
    = Block Color Bool { width : Float, height : Float }
    | Circle Color Bool


type Color
    = Green
    | Gray


view : Activity -> Html msg
view activity =
    case activityType activity of
        Activity.Run ->
            Block Green activity.completed { width = toWidth (Maybe.withDefault Activity.Easy activity.pace), height = toHeight activity.duration }
                |> viewShape

        Activity.Other ->
            Circle Gray activity.completed
                |> viewShape


viewDefault : Bool -> Activity.ActivityType -> Html msg
viewDefault completed activityType =
    case activityType of
        Activity.Run ->
            Block Green completed { width = 2, height = 1 }
                |> viewShape

        Activity.Other ->
            Circle Gray completed
                |> viewShape


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

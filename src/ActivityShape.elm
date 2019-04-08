module ActivityShape exposing (Model, init, view)

import Activity exposing (Pace(..))
import Html exposing (Html, div)
import Html.Attributes exposing (class, style)
import Svg exposing (circle, svg)
import Svg.Attributes exposing (cx, cy, fill, height, r, width)


type Model
    = Block Color { width : Int, height : Int }
    | Circle Color


type Color
    = Green


init : Maybe Activity.Pace -> Maybe Activity.Minutes -> Model
init paceM durationM =
    Maybe.map2 (\pace duration -> Block Green { width = toWidth pace, height = toHeight duration }) paceM durationM
        |> Maybe.withDefault (Circle Green)


view : Model -> Html msg
view model =
    case model of
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
            30

        Moderate ->
            60

        Hard ->
            90

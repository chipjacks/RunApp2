module Skeleton exposing (attributeIf, column, compactColumn, expandingRow, layout, row, styleIf, viewIf)

import Html exposing (Html, div, i, img, text)
import Html.Attributes exposing (class, src, style)


layout : Bool -> Html msg -> Html msg
layout updating page =
    column [ class "container-y" ]
        [ row [ class "navbar" ]
            [ column [ class "container-x" ]
                [ row [ style "font-size" "1.5rem" ]
                    [ compactColumn [ style "font-style" "italic" ] [ text "RunApp2" ]
                    , viewIf updating (compactColumn [] [ text "..." ])
                    ]
                ]
            ]
        , expandingRow []
            [ column [ class "container-x" ]
                [ page ]
            ]
        ]


row : List (Html.Attribute msg) -> List (Html msg) -> Html msg
row attributes children =
    div
        (class "row compact" :: attributes)
        children


expandingRow : List (Html.Attribute msg) -> List (Html msg) -> Html msg
expandingRow attributes children =
    div
        (class "row expand" :: attributes)
        children


column : List (Html.Attribute msg) -> List (Html msg) -> Html msg
column attributes children =
    div
        (class "column expand" :: attributes)
        children


compactColumn : List (Html.Attribute msg) -> List (Html msg) -> Html msg
compactColumn attributes children =
    div
        (class "column compact" :: attributes)
        children


styleIf : Bool -> String -> String -> Html.Attribute msg
styleIf bool name value =
    if bool then
        style name value

    else
        style "" ""


viewIf : Bool -> Html msg -> Html msg
viewIf bool html =
    if bool then
        html

    else
        Html.text ""


attributeIf : Bool -> Html.Attribute msg -> Html.Attribute msg
attributeIf bool attr =
    if bool then
        attr

    else
        style "" ""

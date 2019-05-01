module Skeleton exposing (column, expandingRow, layout, row, twoColumns)

import Html exposing (Html, div, text)
import Html.Attributes exposing (class, style)


layout : Html msg -> Html msg
layout page =
    column [ class "container" ]
        [ row [ style "justify-content" "center" ] [ text "HEADER" ]
        , page
        , row [ style "justify-content" "center" ] [ text "FOOTER" ]
        ]


row : List (Html.Attribute msg) -> List (Html msg) -> Html msg
row attributes children =
    div
        (class "row no-grow" :: attributes)
        children


expandingRow : List (Html.Attribute msg) -> List (Html msg) -> Html msg
expandingRow attributes children =
    div
        (class "row" :: attributes)
        children


column : List (Html.Attribute msg) -> List (Html msg) -> Html msg
column attributes children =
    div
        (class "column" :: attributes)
        children


twoColumns : List (Html msg) -> List (Html msg) -> List (Html msg)
twoColumns left right =
    [ column [ class "center", style "flex-grow" "1" ] <| left
    , column [ class "center", style "flex-grow" "3" ] <| right
    ]

module Skeleton exposing (column, compactColumn, expandingRow, layout, row)

import Html exposing (Html, div, i, img, text)
import Html.Attributes exposing (class, src, style)


layout : Html msg -> Html msg
layout page =
    column [ class "container-y" ]
        [ row [ class "navbar" ]
            [ column [ class "container-x" ]
                [ row [ style "font-size" "1.5rem" ]
                    [ compactColumn [ style "font-style" "italic" ] [ text "RunApp2" ]
                    , column [] []
                    , compactColumn []
                        [ i [ class "fas fa-user-circle", style "padding-top" "0.2rem" ] []
                        ]
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

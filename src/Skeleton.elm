module Skeleton exposing (column, expandingRow, layout, row, twoColumns)

import Html exposing (Html, div, img, text)
import Html.Attributes exposing (class, src, style)


layout : Html msg -> Html msg
layout page =
    column [ class "container-y" ]
        [ row [ class "navbar" ]
            [ column [ class "container-x" ]
                [ row []
                    [ compactColumn [ style "font-size" "1.5rem", style "font-style" "italic" ] [ text "RunApp2" ]
                    , column [] []
                    , compactColumn []
                        [ img [ style "height" "1.8rem", src "assets/account.svg" ] []
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


twoColumns : List (Html msg) -> List (Html msg) -> List (Html msg)
twoColumns left right =
    [ column [ class "center", style "flex-grow" "1" ] <| left
    , column [ class "center", style "flex-grow" "3" ] <| right
    ]

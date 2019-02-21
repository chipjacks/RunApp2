module BlockList exposing (Model, view)

import Activity exposing (Activity)
import Date exposing (Date)
import Html exposing (Html, a, button, div, input, text)
import Html.Attributes exposing (class, href, id, placeholder, type_)
import Html.Events exposing (onClick, onInput)
import Link


type alias Model =
    { date : Date
    }


view : (Date -> List Activity) -> (Activity -> msg) -> msg -> Model -> Html msg
view getBlocks editActivity submitActivity { date } =
    div [ class "column", id "blocks" ]
        [ text ("Blocks " ++ Date.toIsoString date)
        , a [ href (Link.toCalendar (Just date)) ]
            [ text "Calendar" ]
        , div [ class "ui padded grid" ]
            (List.map viewBlock (getBlocks date))
        , div [ class "ui action input" ]
            [ input
                [ type_ "text"
                , placeholder "Description"
                , onInput (\description -> editActivity (Activity Nothing description))
                ]
                []
            , button
                [ class "ui button"
                , onClick submitActivity
                ]
                [ text "Add" ]
            ]
        ]


viewBlock : Activity -> Html msg
viewBlock activity =
    div [ class "row" ] [ text activity.description ]

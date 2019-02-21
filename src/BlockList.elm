module BlockList exposing (Model, view)

import Activities exposing (Activity)
import Date exposing (Date)
import Html exposing (Html, a, button, div, input, text)
import Html.Attributes exposing (class, href, id, placeholder, type_)
import Html.Events exposing (onClick, onInput)
import Link


type alias Model =
    { date : Date
    }


view : Activities.Model -> (Activities.Msg -> msg) -> Model -> Html msg
view activities parentMsg { date } =
    div [ class "column", id "blocks" ]
        [ text ("Blocks " ++ Date.toIsoString date)
        , a [ href (Link.toCalendar (Just date)) ]
            [ text "Calendar" ]
        , div [ class "ui padded grid" ]
            (List.map viewBlock (Activities.list activities))
        , div [ class "ui action input" ]
            [ input
                [ type_ "text"
                , placeholder "Description"
                , onInput
                    (\description ->
                        Activity Nothing description
                            |> Activities.edit
                            |> parentMsg
                    )
                ]
                []
            , button
                [ class "ui button"
                , onClick (parentMsg Activities.submit)
                ]
                [ text "Add" ]
            ]
        ]


viewBlock : Activity -> Html msg
viewBlock activity =
    div [ class "row" ] [ text activity.description ]

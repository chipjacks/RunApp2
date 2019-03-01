module ActivityForm exposing (view)

import Activity exposing (NewActivity)
import Html exposing (Html, button, div, input, text)
import Html.Attributes exposing (class, id, placeholder, type_, value)
import Html.Events exposing (onClick, onInput)



{- GOOD EXAMPLE:
   https://github.com/rtfeldman/elm-spa-example/blob/master/src/Page/Settings.elm
-}


view : NewActivity -> (String -> msg) -> msg -> Html msg
view activity onDescription onSubmit =
    div [ class "column grow", id "activity" ]
        [ input
            [ type_ "text"
            , placeholder "Description"
            , onInput onDescription
            , value activity.description
            ]
            []
        , button
            [ onClick onSubmit
            ]
            [ text "Add" ]
        ]

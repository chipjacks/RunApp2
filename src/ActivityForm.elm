module ActivityForm exposing (ActivityForm, toActivity, view)

import Activity exposing (Activity)
import Html exposing (Html, button, div, input, text)
import Html.Attributes exposing (class, id, placeholder, type_, value)
import Html.Events exposing (onClick, onInput)
import Random
import Task exposing (Task)
import Time exposing (utc)
import Uuid.Barebones exposing (uuidStringGenerator)



{- GOOD EXAMPLE:
   https://github.com/rtfeldman/elm-spa-example/blob/master/src/Page/Settings.elm
-}


type alias ActivityForm =
    { id : Maybe String
    , description : String
    }


toActivity : ActivityForm -> Task Never Activity
toActivity activityForm =
    case activityForm.id of
        Just id ->
            Task.succeed (Activity id activityForm.description)

        Nothing ->
            Time.now
                |> Task.map (\t -> Random.initialSeed (Time.toMillis utc t))
                |> Task.map (Random.step uuidStringGenerator)
                |> Task.map
                    (\( uuid, _ ) ->
                        Activity uuid activityForm.description
                    )


view : ActivityForm -> (String -> msg) -> msg -> Html msg
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
            [ text "Save" ]
        ]

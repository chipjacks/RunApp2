module ActivityForm exposing (ActivityForm, SubmitError(..), toActivity, view)

import Activity exposing (Activity)
import Date exposing (Date)
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


type SubmitError
    = ApiError
    | IdError
    | MissingDateError


toActivity : ActivityForm -> Maybe Date -> Task SubmitError Activity
toActivity activityForm dateM =
    let
        idT =
            case activityForm.id of
                Just id ->
                    Task.succeed id

                Nothing ->
                    Time.now
                        |> Task.map (\t -> Random.initialSeed (Time.toMillis utc t))
                        |> Task.map (Random.step uuidStringGenerator)
                        |> Task.map (\( uuid, _ ) -> uuid)

        dateT =
            case dateM of
                Just date ->
                    Task.succeed date

                Nothing ->
                    Task.fail MissingDateError
    in
    Task.map2
        (\id date -> Activity id (Date.toIsoString date) activityForm.description)
        idT
        dateT


view : ActivityForm -> Maybe Date -> (String -> msg) -> msg -> Html msg
view activity dateM onDescription onSubmit =
    div [ class "column grow", id "activity" ]
        [ div [] [ text (Maybe.map Date.toIsoString dateM |> Maybe.withDefault "") ]
        , input
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

module ActivityForm exposing (Model, Msg, init, update, view)

import Activity exposing (Activity)
import Api exposing (saveActivity)
import Html exposing (Html, button, div, input, text)
import Html.Attributes exposing (class, id, placeholder, type_)
import Html.Events exposing (onClick, onInput)
import Http
import Random
import Task
import Uuid.Barebones exposing (uuidStringGenerator)



{- GOOD EXAMPLE:
   https://github.com/rtfeldman/elm-spa-example/blob/master/src/Page/Settings.elm
-}


type alias Model =
    { form : Form
    , status : Status
    }


type alias Form =
    { description : String
    }


type Status
    = Loading
    | LoadedId String
    | Submitted
    | Error String


type Msg
    = Description String
    | Id String
    | Submit
    | SubmitResult (Result Http.Error (List Activity))


init : Maybe Activity -> Model
init activityM =
    case activityM of
        Nothing ->
            Model (Form "") Loading

        Just activity ->
            Model (Form activity.description) (LoadedId activity.id)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Description desc ->
            updateForm (\a -> { a | description = desc }) model

        Id id ->
            case model.status of
                Loading ->
                    ( { model | status = LoadedId id }, Cmd.none )

                Submitted ->
                    ( model
                    , Task.attempt
                        SubmitResult
                        (saveActivity (Activity id model.form.description))
                    )

                _ ->
                    ( model, Cmd.none )

        Submit ->
            case model.status of
                LoadedId id ->
                    ( { model | status = Submitted }
                    , Task.attempt
                        SubmitResult
                        (saveActivity (Activity id model.form.description))
                    )

                Loading ->
                    ( { model | status = Submitted }, generateId )

                _ ->
                    ( model, Cmd.none )

        SubmitResult result ->
            case result of
                Ok _ ->
                    ( init Nothing, Cmd.none )

                Err error ->
                    ( { model | status = Error "There was an error submitting the form" }, Cmd.none )


updateForm : (Form -> Form) -> Model -> ( Model, Cmd msg )
updateForm transform model =
    ( { model | form = transform model.form }, Cmd.none )


generateId : Cmd Msg
generateId =
    Random.generate Id uuidStringGenerator


view : Model -> Html Msg
view model =
    div [ class "column grow", id "activity" ]
        [ input
            [ type_ "text"
            , placeholder "Description"
            , onInput Description
            ]
            []
        , button
            [ onClick Submit
            ]
            [ text "Add" ]
        ]

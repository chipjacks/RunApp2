module ActivityForm exposing (Model, Msg(..), SubmitError(..), dateRequested, initEdit, initNew, selectDate, toActivity, update, view)

import Activity exposing (Activity)
import Api
import Date exposing (Date)
import Html exposing (Html, button, div, input, text)
import Html.Attributes exposing (class, id, name, placeholder, type_, value)
import Html.Events exposing (onClick, onInput)
import Random
import Task exposing (Task)
import Time exposing (Month(..), utc)
import Uuid.Barebones exposing (uuidStringGenerator)



{- GOOD EXAMPLE:
   https://github.com/rtfeldman/elm-spa-example/blob/master/src/Page/Settings.elm
-}


type alias Model =
    { id : Maybe String
    , date : Maybe Date
    , description : String
    , error : Maybe SubmitError
    }


type Msg
    = EditedDescription String
    | RequestDate
    | GotDate Date
    | ClickedSubmit
    | GotSubmitResult (Result SubmitError (List Activity))


type SubmitError
    = ApiError
    | MissingDateError


initNew : Model
initNew =
    Model Nothing Nothing "" Nothing


initEdit : Activity -> Model
initEdit activity =
    Model (Just activity.id) (Just activity.date) activity.description Nothing


dateRequested : Model -> Bool
dateRequested model =
    case model.date of
        Just date ->
            False

        Nothing ->
            True


selectDate : Model -> Date -> Model
selectDate model date =
    update (GotDate date) model |> Tuple.first


toActivity : Model -> Task SubmitError Activity
toActivity activityForm =
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
            case activityForm.date of
                Just date ->
                    Task.succeed date

                Nothing ->
                    Task.fail MissingDateError
    in
    Task.map2
        (\id date -> Activity id date activityForm.description)
        idT
        dateT


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        EditedDescription desc ->
            ( { model | description = desc }, Cmd.none )

        RequestDate ->
            ( { model | date = Nothing }, Cmd.none )

        GotDate date ->
            ( { model | date = Just date }, Cmd.none )

        ClickedSubmit ->
            let
                saveActivityT =
                    toActivity model
                        |> Task.andThen (\a -> Api.saveActivity a |> Task.mapError (\_ -> ApiError))
            in
            ( initNew, Task.attempt GotSubmitResult saveActivityT )

        GotSubmitResult result ->
            case result of
                Ok activities ->
                    ( model, Cmd.none )

                Err error ->
                    ( { model | error = Just error }, Cmd.none )


view : Model -> Html Msg
view model =
    div [ class "column", id "activity" ]
        [ viewError model.error
        , input
            [ type_ "text"
            , placeholder "Description"
            , onInput EditedDescription
            , name "description"
            , value model.description
            ]
            []
        , selectDateButton model.date
        , button
            [ onClick ClickedSubmit
            ]
            [ text "Save" ]
        ]


selectDateButton : Maybe Date -> Html Msg
selectDateButton dateM =
    let
        content =
            case dateM of
                Just date ->
                    Date.toIsoString date

                Nothing ->
                    "Select Date"
    in
    button [ name "date", onClick RequestDate ] [ text content ]


viewError : Maybe SubmitError -> Html Msg
viewError errorM =
    case errorM of
        Just error ->
            div [ class "error" ] [ text <| errorMessage error ]

        Nothing ->
            div [ class "error" ] []


errorMessage : SubmitError -> String
errorMessage error =
    case error of
        MissingDateError ->
            "missing date"

        _ ->
            "there has been an error"

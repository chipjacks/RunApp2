module ActivityForm exposing (Model, Msg(..), SubmitError(..), dateRequested, initEdit, initNew, selectDate, toActivity, update, view)

import Activity exposing (Activity, Minutes)
import Api
import Date exposing (Date)
import Html exposing (Html, button, div, input, text)
import Html.Attributes exposing (class, id, name, placeholder, type_, value)
import Html.Events exposing (on, onClick, onInput)
import Json.Decode as Decode
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
    , duration : Maybe Minutes
    , pace : Maybe Activity.Pace
    , error : Maybe SubmitError
    }


type Msg
    = EditedDescription String
    | EditedDuration String
    | SelectedPace String
    | RequestDate
    | GotDate Date
    | ClickedSubmit
    | ClickedReset
    | ClickedDelete
    | GotSubmitResult (Result SubmitError (List Activity))
    | GotDeleteResult (Result SubmitError (List Activity))


type SubmitError
    = ApiError
    | EmptyFieldError String
    | MissingIdError


initNew : Model
initNew =
    Model Nothing Nothing "" Nothing Nothing Nothing


initEdit : Activity -> Model
initEdit activity =
    Model (Just activity.id) (Just activity.date) activity.description (Just activity.duration) (Just activity.pace) Nothing


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
    in
    Task.map5
        Activity
        idT
        (validateFieldExists activityForm.date "date")
        (Task.succeed activityForm.description)
        (validateFieldExists activityForm.duration "duration")
        (validateFieldExists activityForm.pace "pace")


validateFieldExists : Maybe a -> String -> Task SubmitError a
validateFieldExists fieldM fieldName =
    case fieldM of
        Just field ->
            Task.succeed field

        Nothing ->
            Task.fail <| EmptyFieldError fieldName


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        EditedDescription desc ->
            ( { model | description = desc }, Cmd.none )

        EditedDuration str ->
            let
                minutes =
                    String.toInt str
            in
            ( { model | duration = minutes }, Cmd.none )

        SelectedPace str ->
            ( { model | pace = Activity.pace.fromString str }, Cmd.none )

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

        ClickedReset ->
            ( initNew, Cmd.none )

        ClickedDelete ->
            let
                deleteActivityT =
                    case model.id of
                        Just id ->
                            Api.deleteActivity id |> Task.mapError (\_ -> ApiError)

                        Nothing ->
                            Task.fail MissingIdError
            in
            ( initNew, Task.attempt GotDeleteResult deleteActivityT )

        GotSubmitResult result ->
            case result of
                Ok activities ->
                    ( model, Cmd.none )

                Err error ->
                    ( { model | error = Just error }, Cmd.none )

        GotDeleteResult result ->
            case result of
                Ok activities ->
                    ( model, Cmd.none )

                Err error ->
                    ( { model | error = Just error }, Cmd.none )


view : Model -> Html Msg
view model =
    div [ class "column", id "activity" ]
        [ viewError model.error
        , selectDateButton model.date
        , input
            [ type_ "text"
            , placeholder "Description"
            , onInput EditedDescription
            , name "description"
            , value model.description
            ]
            []
        , input
            [ type_ "number"
            , placeholder "Duration"
            , onInput EditedDuration
            , name "duration"
            , value (model.duration |> Maybe.map String.fromInt |> Maybe.withDefault "")
            ]
            []
        , selectPace model.pace
        , button
            [ onClick ClickedSubmit
            ]
            [ text "Save" ]
        , button
            [ onClick ClickedReset
            ]
            [ text "Reset" ]
        , button
            [ onClick ClickedDelete
            ]
            [ text "Delete" ]
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


selectPace : Maybe Activity.Pace -> Html Msg
selectPace paceM =
    Html.select
        [ onInput SelectedPace
        , name "pace"
        , value (paceM |> Maybe.map Activity.pace.toString |> Maybe.withDefault "Pace")
        ]
        (Html.option [] [ Html.text "Pace" ]
            :: List.map
                (\( paceStr, pace ) ->
                    Html.option [] [ Html.text paceStr ]
                )
                Activity.pace.list
        )


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
        EmptyFieldError field ->
            "Please fill in " ++ field ++ " field"

        _ ->
            "There has been an error"

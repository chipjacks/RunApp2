module Activities exposing (Activity, Model, Msg, WebData(..), edit, fetch, init, submit, update)

import Date exposing (Date)
import Http
import Json.Decode as Decode
import Json.Encode as Encode
import Time exposing (Month(..))


type alias Activity =
    { id : Maybe String
    , description : String
    }


type WebData a
    = Loading
    | Failure Http.Error
    | Success a


type alias Model =
    { fetching : WebData (List Activity)
    , editing : Maybe Activity
    }


init : Model
init =
    Model Loading Nothing


type Msg
    = FetchedStore (Result Http.Error (List Activity))
    | EditedForm Activity
    | SubmittedForm
    | UpdatedStore (Result Http.Error Activity)


fetch : Model -> Date -> Cmd Msg
fetch model date =
    Http.get
        { url = "http://localhost:4567/activities.json"
        , expect =
            Http.expectJson
                FetchedStore
                (Decode.list decoder)
        }


edit : Activity -> Msg
edit activity =
    EditedForm activity


submit : Msg
submit =
    SubmittedForm


sendEdit : Activity -> Cmd Msg
sendEdit activity =
    case activity.id of
        Nothing ->
            Debug.todo "send edits"

        Just id ->
            Debug.todo "send edits"


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FetchedStore activitiesR ->
            case activitiesR of
                Ok activities ->
                    ( { model | fetching = Success activities }, Cmd.none )

                Err error ->
                    ( { model | fetching = Failure error }, Cmd.none )

        EditedForm activity ->
            ( { model | editing = Just activity }, Cmd.none )

        SubmittedForm ->
            case model.editing of
                Just activity ->
                    ( model, sendEdit activity )

                Nothing ->
                    ( model, Cmd.none )

        UpdatedStore result ->
            ( { model | editing = Nothing }, fetch model (Date.fromCalendarDate 2019 Jan 1) )


decoder : Decode.Decoder Activity
decoder =
    Decode.map2 Activity
        (Decode.field "id" Decode.string |> Decode.map Just)
        (Decode.field "description" Decode.string)


encode : Activity -> Encode.Value
encode activity =
    Encode.object
        [ ( "description", Encode.string activity.description )
        ]

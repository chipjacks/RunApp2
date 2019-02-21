module Activities exposing (Activity, Model, Msg, edit, fetch, init, list, submit, update)

import Date exposing (Date)
import Json.Decode as Decode
import Json.Encode as Encode
import Kinto
import Time exposing (Month(..))


type alias Activity =
    { id : Maybe String
    , description : String
    }


type alias Model =
    { activities : Kinto.Pager Activity
    , editing : Maybe Activity
    }


init : Model
init =
    Model (Kinto.emptyPager client resource) Nothing


type Msg
    = Fetched (Result Kinto.Error (Kinto.Pager Activity))
    | Edit Activity
    | Submit
    | Updated (Result Kinto.Error Activity)


client : Kinto.Client
client =
    Kinto.client
        "https://kinto.dev.mozaws.net/v1/"
        (Kinto.Basic "chip" "password")


fetch : Model -> Date -> Cmd Msg
fetch model date =
    model.activities.client
        |> Kinto.getList resource
        |> Kinto.send Fetched


edit : Activity -> Msg
edit activity =
    Edit activity


list : Model -> List Activity
list model =
    model.activities.objects


submit : Msg
submit =
    Submit


sendEdit : Activity -> Cmd Msg
sendEdit activity =
    case activity.id of
        Nothing ->
            client
                |> Kinto.create resource (encode activity)
                |> Kinto.send Updated

        Just id ->
            client
                |> Kinto.update resource id (encode activity)
                |> Kinto.send Updated


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Fetched activitiesR ->
            case activitiesR of
                Ok activitiesPager ->
                    ( { model | activities = activitiesPager }, Cmd.none )

                Err error ->
                    Debug.todo "Deal with error"

        Edit activity ->
            ( { model | editing = Just activity }, Cmd.none )

        Submit ->
            case model.editing of
                Just activity ->
                    ( model, sendEdit activity )

                Nothing ->
                    ( model, Cmd.none )

        Updated result ->
            ( { model | editing = Nothing }, fetch model (Date.fromCalendarDate 2019 Jan 1) )


resource : Kinto.Resource Activity
resource =
    Kinto.recordResource "default" "activities" decoder


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

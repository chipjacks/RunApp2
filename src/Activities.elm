module Activities exposing (Activity, Model, Msg, WebData(..), fetchedStore, getActivities, init, saveActivity, update)

import Date exposing (Date)
import Http
import Json.Decode as Decode
import Json.Encode as Encode
import Task exposing (Task)
import Time exposing (Month(..))


type alias Activity =
    { id : String
    , description : String
    }


type WebData a
    = Loading
    | Failure Http.Error
    | Success a


type alias Model =
    { fetching : WebData (List Activity)
    , sending : Maybe Activity
    }


init : Model
init =
    Model Loading Nothing


type Msg
    = FetchedStore (Result Http.Error (List Activity))
    | SaveActivity Activity
    | UpdatedStore (Result Http.Error (List Activity))


storeUrl =
    "https://api.jsonbin.io/b/5c745db056292a73eb718d29"


fetchedStore =
    FetchedStore


getActivities : Task Http.Error (List Activity)
getActivities =
    Http.task
        { method = "GET"
        , headers = [ Http.header "Content-Type" "application/json" ]
        , url = storeUrl ++ "/latest"
        , body = Http.emptyBody
        , resolver = Http.stringResolver <| handleJsonResponse <| Decode.list activityDecoder
        , timeout = Nothing
        }


postActivities : List Activity -> Task Http.Error (List Activity)
postActivities activities =
    Http.task
        { method = "PUT"
        , headers = []
        , url = storeUrl
        , body = Http.jsonBody (Encode.list encode activities)
        , resolver = Http.stringResolver <| handleJsonResponse <| Decode.list activityDecoder
        , timeout = Nothing
        }


saveActivity : Activity -> Task Http.Error (List Activity)
saveActivity activity =
    getActivities
        |> Task.map
            (\activities ->
                List.partition (\a -> a.id == activity.id) activities
                    |> (\( oldActivity, others ) -> activity :: others)
            )
        |> Task.andThen postActivities


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FetchedStore activitiesR ->
            case activitiesR of
                Ok activities ->
                    case model.sending of
                        Just activity ->
                            updateStore activity model

                        Nothing ->
                            ( { model | fetching = Success activities }, Cmd.none )

                Err error ->
                    ( { model | fetching = Failure error }, Cmd.none )

        SaveActivity activity ->
            ( { model | sending = Just activity }, Task.attempt FetchedStore getActivities )

        UpdatedStore result ->
            case result of
                Ok activities ->
                    ( { model | sending = Nothing }, Cmd.none )

                Err error ->
                    let
                        log =
                            Debug.log "Error updating store" error
                    in
                    ( model, Cmd.none )


updateStore : Activity -> Model -> ( Model, Cmd Msg )
updateStore activity model =
    case model.fetching of
        Success activities ->
            ( model
            , List.partition (\a -> a.id == activity.id) activities
                |> (\( oldActivity, others ) -> activity :: others)
                |> (\updatedActivities -> Task.attempt UpdatedStore (postActivities updatedActivities))
            )

        _ ->
            ( model, Cmd.none )


activityDecoder : Decode.Decoder Activity
activityDecoder =
    Decode.map2 Activity
        (Decode.field "id" Decode.string)
        (Decode.field "description" Decode.string)


encode : Activity -> Encode.Value
encode activity =
    Encode.object
        [ ( "id", Encode.string activity.id )
        , ( "description", Encode.string activity.description )
        ]


handleJsonResponse : Decode.Decoder a -> Http.Response String -> Result Http.Error a
handleJsonResponse decoder response =
    case response of
        Http.BadUrl_ url ->
            Err (Http.BadUrl url)

        Http.Timeout_ ->
            Err Http.Timeout

        Http.BadStatus_ { statusCode } _ ->
            Err (Http.BadStatus statusCode)

        Http.NetworkError_ ->
            Err Http.NetworkError

        Http.GoodStatus_ _ body ->
            case Decode.decodeString decoder body of
                Err _ ->
                    Err (Http.BadBody body)

                Ok result ->
                    Ok result

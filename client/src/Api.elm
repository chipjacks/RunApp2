module Api exposing (createActivity, deleteActivity, getActivities, saveActivity)

import Activity exposing (Activity)
import Http
import Json.Decode as Decode
import Json.Encode as Encode
import Random
import Task exposing (Task)
import Time exposing (Month(..), utc)
import Uuid.Barebones exposing (uuidStringGenerator)


getActivities : Task Http.Error (List Activity)
getActivities =
    Http.task
        { method = "GET"
        , headers = [ Http.header "Content-Type" "application/json" ]
        , url = storeUrl ++ "/latest"
        , body = Http.emptyBody
        , resolver =
            Http.stringResolver <|
                handleJsonResponse <|
                    Decode.list Activity.decoder
        , timeout = Nothing
        }


saveActivity : Activity -> Task Http.Error (List Activity)
saveActivity activity =
    getActivities
        |> Task.map
            (\activities ->
                List.partition (\a -> a.id == activity.id) activities
                    |> (\( _, others ) -> activity :: others)
            )
        |> Task.andThen postActivities


createActivity : (Activity.Id -> Activity) -> Task Http.Error (List Activity)
createActivity idToActivity =
    let
        addIdTask =
            Time.now
                |> Task.map (\t -> Random.initialSeed (Time.toMillis utc t))
                |> Task.map (Random.step uuidStringGenerator)
                |> Task.map (\( uuid, _ ) -> idToActivity uuid)

        saveTask activity =
            getActivities
                |> Task.map
                    (\activities -> activity :: activities)
                |> Task.andThen postActivities
    in
    addIdTask
        |> Task.andThen saveTask


deleteActivity : Activity.Id -> Task Http.Error (List Activity)
deleteActivity id =
    getActivities
        |> Task.map
            (\activities ->
                List.partition (\a -> a.id == id) activities
                    |> (\( _, others ) -> others)
            )
        |> Task.andThen postActivities



-- INTERNAL


storeUrl =
    "https://api.jsonbin.io/b/5c745db056292a73eb718d29"


postActivities : List Activity -> Task Http.Error (List Activity)
postActivities activities =
    Http.task
        { method = "PUT"
        , headers = []
        , url = storeUrl
        , body = Http.jsonBody (Encode.list Activity.encoder activities)
        , resolver =
            Http.stringResolver <|
                handleJsonResponse <|
                    Decode.field "data" (Decode.list Activity.decoder)
        , timeout = Nothing
        }


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

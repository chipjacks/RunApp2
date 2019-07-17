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
        { method = "POST"
        , headers = [ Http.header "Content-Type" "application/json" ]
        , url = storeUrl
        , body = Http.stringBody "" """{"operationName":null,"variables":{},"query":"{ activities { id completed date description duration pace }}"}"""
        , resolver =
            Http.stringResolver <|
                handleJsonResponse <|
                    (Decode.field "data" <| Decode.field "activities" <| Decode.list Activity.decoder)
        , timeout = Nothing
        }


saveActivity : Activity -> Task Http.Error (List Activity)
saveActivity activity =
    deleteActivity activity.id
        |> Task.andThen (\r -> createActivity (\id -> activity))


createActivity : (Activity.Id -> Activity) -> Task Http.Error (List Activity)
createActivity idToActivity =
    let
        addIdTask =
            Time.now
                |> Task.map (\t -> Random.initialSeed (Time.toMillis utc t))
                |> Task.map (Random.step uuidStringGenerator)
                |> Task.map (\( uuid, _ ) -> idToActivity uuid)

        saveTask activity =
            Http.task
                { method = "POST"
                , headers = [ Http.header "Content-Type" "application/json" ]
                , url = storeUrl
                , body =
                    Http.stringBody "" <|
                        List.foldr (++)
                            ""
                            [ "{\"query\": \""
                            , "mutation CreateActivity($activity: ActivityInput!) {  createActivity(activity: $activity"
                            , ") {    success    message    activities {      id      completed      date      description      duration      pace    }  }}"
                            , "\", \"variables\": {\"activity\": "
                            , Encode.encode 0 (Activity.encoder activity)
                            , "} }"
                            ]
                , resolver =
                    Http.stringResolver <|
                        handleJsonResponse <|
                            Decode.at [ "data", "createActivity", "activities" ] (Decode.list Activity.decoder)
                , timeout = Nothing
                }
    in
    addIdTask
        |> Task.andThen saveTask


deleteActivity : Activity.Id -> Task Http.Error (List Activity)
deleteActivity id =
    Http.task
        { method = "POST"
        , headers = [ Http.header "Content-Type" "application/json" ]
        , url = storeUrl
        , body =
            Http.stringBody "" <|
                List.foldr (++)
                    ""
                    [ "{\"query\": \""
                    , "mutation {  deleteActivity(activityId: \\\""
                    , id
                    , "\\\") {    success    message    activities {      id      completed      date      description      duration      pace    }  }}"
                    , "\"}"
                    ]
        , resolver =
            Http.stringResolver <|
                handleJsonResponse <|
                    Decode.at [ "data", "deleteActivity", "activities" ] (Decode.list Activity.decoder)
        , timeout = Nothing
        }



-- INTERNAL


storeUrl =
    "/api"


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

module Api exposing (getActivities, postActivities)

import Activity exposing (Activity)
import Http
import Json.Decode as Decode
import Json.Encode as Encode
import Random
import Task exposing (Task)
import Time exposing (Month(..), utc)


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



-- INTERNAL


storeUrl =
    "https://api.jsonbin.io/b/5ce402ac0e7bd93ffac14a4c"


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

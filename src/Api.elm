module Api exposing (getActivities, postActivities)

import Activity exposing (Activity)
import Http
import Json.Decode as Decode
import Json.Encode as Encode
import Random
import Task exposing (Task)
import Time exposing (Month(..), utc)


getActivities : Task String ( String, List Activity )
getActivities =
    Http.task
        { method = "GET"
        , headers = [ Http.header "Content-Type" "application/json", authHeader ]
        , url = storeUrl
        , body = Http.emptyBody
        , resolver =
            Http.stringResolver <|
                handleJsonResponse <|
                    Decode.map2 Tuple.pair
                        (Decode.field "_rev" Decode.string)
                        (Decode.field "activities" (Decode.list Activity.decoder))
        , timeout = Nothing
        }


postActivities : String -> List Activity -> Task String (List Activity)
postActivities revision activities =
    Http.task
        { method = "PUT"
        , headers = [ Http.header "Content-Type" "application/json", authHeader ]
        , url = storeUrl
        , body = Http.jsonBody (Encode.object [ ( "_rev", Encode.string revision ), ( "activities", Encode.list Activity.encoder activities ) ])
        , resolver =
            Http.stringResolver <|
                handleJsonResponse <|
                    Decode.field "activities" (Decode.list Activity.decoder)
        , timeout = Nothing
        }



-- INTERNAL


storeUrl =
    "https://6483b615-f5bc-4f3d-8b78-188c8df679dc-bluemix.cloudantnosqldb.appdomain.cloud/runapp2/428e9b77627a652f297c35eedca65c95"


authHeader =
    Http.header "Authorization" "Basic YXBpa2V5LTNhZDlmYjFjYTE2MjQyNzZhZjFhNTYwMjc2ODhlY2M5OjA1ZmE1NTU0OTFhZjI2NzkyZmFmM2I1YTgwZjY0YmI4NjcwOGIzNjQ="


handleJsonResponse : Decode.Decoder a -> Http.Response String -> Result String a
handleJsonResponse decoder response =
    case response of
        Http.BadUrl_ url ->
            Err ("Bad URL: " ++ url)

        Http.Timeout_ ->
            Err "Timeout"

        Http.BadStatus_ { statusCode } _ ->
            Err ("Bad status code: " ++ String.fromInt statusCode)

        Http.NetworkError_ ->
            Err "Network error"

        Http.GoodStatus_ _ body ->
            case Decode.decodeString decoder body of
                Err decoderErr ->
                    Err (Decode.errorToString decoderErr)

                Ok result ->
                    Ok result

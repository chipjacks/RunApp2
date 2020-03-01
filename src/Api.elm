module Api exposing (createActivity, deleteActivity, getActivities, saveActivity, updateActivity)

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


saveActivity : Activity -> Task Http.Error (List Activity)
saveActivity activity =
    getActivities
        |> Task.map (updateActivity activity False)
        |> Task.andThen postActivities


createActivity : Activity -> Task Http.Error (List Activity)
createActivity activity =
    getActivities
        |> Task.map
            (updateActivity activity True)
        |> Task.andThen postActivities


deleteActivity : Activity.Id -> Task Http.Error (List Activity)
deleteActivity id =
    getActivities
        |> Task.map
            (\activities ->
                List.partition (\a -> a.id == id) activities
                    |> (\( _, others ) -> others)
            )
        |> Task.andThen postActivities


updateActivity : Activity -> Bool -> List Activity -> List Activity
updateActivity update isNew activities =
    if isNew then
        List.append activities [ update ]

    else
        List.map
            (\existing ->
                if existing.id == update.id then
                    update

                else
                    existing
            )
            activities



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

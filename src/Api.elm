module Api exposing (getActivities, saveActivity)

import Activity exposing (Activity)
import Date exposing (Date)
import Http
import Json.Decode as Decode
import Json.Encode as Encode
import Task exposing (Task)
import Time exposing (Month(..))


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


saveActivity : Activity -> Task Http.Error (List Activity)
saveActivity activity =
    getActivities
        |> Task.map
            (\activities ->
                List.partition (\a -> a.id == activity.id) activities
                    |> (\( oldActivity, others ) -> activity :: others)
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
        , body = Http.jsonBody (Encode.list activityEncoder activities)
        , resolver = Http.stringResolver <| handleJsonResponse <| Decode.list activityDecoder
        , timeout = Nothing
        }


activityDecoder : Decode.Decoder Activity
activityDecoder =
    Decode.map2 Activity
        (Decode.field "id" Decode.string)
        (Decode.field "description" Decode.string)


activityEncoder : Activity -> Encode.Value
activityEncoder activity =
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

module Calendar exposing (Model, Msg, initCmd, update, urlParser, view)

import Date exposing (Date)
import Html exposing (Html)
import Html.Attributes exposing (href)
import Link
import Task exposing (Task)
import Url.Parser.Query as Query


type Model
    = Loading
    | Problem String
    | Loaded String


type Msg
    = ReceiveDate Date


urlParser : Query.Parser Model
urlParser =
    Query.map
        parseDate
        (Query.int "date")


initCmd : Model -> Cmd Msg
initCmd model =
    case model of
        Loading ->
            Date.today |> Task.perform ReceiveDate

        _ ->
            Cmd.none


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ReceiveDate date ->
            ( Loaded (Date.toIsoString date), Cmd.none )


view : Model -> Html msg
view model =
    case model of
        Loaded date ->
            Html.div []
                [ Html.text ("Calendar " ++ date)
                , Html.a [ Link.toBlockList { date = "1/19/2019" } |> href ]
                    [ Html.text "Blocks" ]
                ]

        Loading ->
            Html.div [] [ Html.text "Loading Calendar" ]

        Problem message ->
            Html.div [] [ Html.text message ]



-- INTERNAL


parseDate : Maybe Int -> Model
parseDate rataDie =
    case rataDie of
        Just int ->
            Loaded (Date.fromRataDie int |> Date.toIsoString)

        Nothing ->
            Loading

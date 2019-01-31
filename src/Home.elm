module Home exposing (Model, Msg(..), init, update, view)

import BlockList
import Calendar
import Date exposing (Date)
import Element exposing (Element, el, row, text)
import Task exposing (Task)


type Model
    = Loading
    | Loaded Date
    | Problem String


type Msg
    = ReceiveDate Date


init : Model
init =
    Loading


view : Model -> Element Msg
view model =
    case model of
        Loaded date ->
            row [] [ Calendar.view date, BlockList.view date ]

        Loading ->
            el [] (text "Loading")

        Problem message ->
            el [] (text message)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ReceiveDate date ->
            ( Loaded date, Cmd.none )

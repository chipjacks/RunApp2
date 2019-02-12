module Home exposing (Column(..), Model, Msg, init, select, update, view)

import BlockList
import Calendar
import Date exposing (Date)
import Element exposing (Device, DeviceClass(..), Element, Orientation(..), el, text)
import OffCanvasLayout exposing (Focus(..))
import Task


type Model
    = Loading
    | LoadedColumn Column
    | Loaded Column Date
    | Problem String


type Column
    = Calendar
    | BlockList


type Msg
    = Select Column (Maybe Date)


select : Column -> Maybe Date -> Msg
select column date =
    Select column date


focus : Column -> Focus
focus column =
    case column of
        Calendar ->
            First

        BlockList ->
            Second


init : Model
init =
    Loading


view : Model -> Element Msg
view model =
    case model of
        Loaded column date ->
            OffCanvasLayout.view
                (Device Phone Portrait)
                (focus column)
                (Calendar.view date)
                (BlockList.view date)
                Element.none

        Loading ->
            el [] (text "Loading")

        LoadedColumn col ->
            el [] (text "Loading")

        Problem message ->
            el [] (text message)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Select column maybeDate ->
            case maybeDate of
                Nothing ->
                    ( LoadedColumn column
                    , Date.today
                        |> Task.perform
                            (\date -> select column (Just date))
                    )

                Just date ->
                    ( Loaded column date, Cmd.none )

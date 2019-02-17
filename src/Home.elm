module Home exposing (Column(..), Model, Msg, init, select, update, view)

import BlockList
import Calendar
import Date exposing (Date)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, id)
import OffCanvasLayout exposing (Focus(..))
import Task
import Window exposing (Window)


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


view : Model -> Window -> Html Msg
view model window =
    case model of
        Loaded column date ->
            OffCanvasLayout.view
                window
                (focus column)
                (Calendar.view date (\d -> select Calendar (Just d)))
                (BlockList.view date)
                (div [ class "column", id "library" ] [ text "Library" ])

        Loading ->
            div [] [ text "Loading" ]

        LoadedColumn col ->
            div [] [ text "Loading" ]

        Problem message ->
            div [] [ text message ]


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

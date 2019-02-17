module Home exposing (Column(..), Model, Msg, init, select, update, view)

import BlockList
import Browser.Dom as Dom
import Calendar
import Date exposing (Date, Unit(..))
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, id)
import Html.Events exposing (on)
import Json.Decode as JD
import OffCanvasLayout exposing (Focus(..))
import Task
import Window exposing (Window)


type Model
    = Loading
    | LoadedColumn Column
    | Loaded Column Date
    | Scrolling Column Date
    | Problem String


type Column
    = Calendar
    | BlockList


type Msg
    = Select Column (Maybe Date)
    | CalendarScroll Int


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
            viewLoaded window column date

        Scrolling column date ->
            viewLoaded window column date

        Loading ->
            div [] [ text "Loading" ]

        LoadedColumn col ->
            div [] [ text "Loading" ]

        Problem message ->
            div [] [ text message ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( Select column maybeDate, _ ) ->
            case maybeDate of
                Nothing ->
                    ( LoadedColumn column
                    , Date.today
                        |> Task.perform
                            (\date -> select column (Just date))
                    )

                Just date ->
                    ( Loaded column date, Cmd.none )

        ( CalendarScroll scrollTop, Loaded column date ) ->
            if scrollTop < 10 then
                ( Scrolling column (Date.add Months -1 date)
                , changeDate column (Date.add Months -1 date)
                )

            else if scrollTop > 490 then
                ( Scrolling column (Date.add Months 1 date)
                , changeDate column (Date.add Months 1 date)
                )

            else
                ( model, Cmd.none )

        ( _, _ ) ->
            ( model, Cmd.none )



-- INTERNAL


viewLoaded : Window -> Column -> Date -> Html Msg
viewLoaded window column date =
    div [ class "row grow equal-width-children", id "home" ] <|
        OffCanvasLayout.view
            window
            (focus column)
            (Calendar.view date onCalendarScroll)
            (BlockList.view date)
            (div [ class "column", id "library" ] [ text "Library" ])


changeDate : Column -> Date -> Cmd Msg
changeDate column date =
    Task.attempt
        (\_ -> Select column (Just date))
        (Dom.setViewportOf "calendar" 0 250)


onCalendarScroll : Html.Attribute Msg
onCalendarScroll =
    on "scroll" decodeToMsg


decodeToMsg : JD.Decoder Msg
decodeToMsg =
    JD.at [ "target", "scrollTop" ] JD.int |> JD.map CalendarScroll

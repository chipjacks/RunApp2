module Main exposing (main)

import Activity exposing (Activity, activityType)
import ActivityForm
import ActivityShape
import Api
import Array
import Browser
import Browser.Dom as Dom
import Calendar
import Config exposing (config)
import Date exposing (Date, Interval(..), Unit(..))
import Html exposing (Html, a, button, div, i, text)
import Html.Attributes exposing (attribute, class, href, id, style)
import Html.Events exposing (on, onClick)
import Http
import Json.Decode as Decode
import Msg exposing (Msg(..))
import Ports
import Random
import Skeleton exposing (column, compactColumn, expandingRow, row, styleIf, viewIf, viewMaybe)
import Store
import Task exposing (Task)
import Time exposing (Month(..))
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), (<?>))
import Url.Parser.Query as Query



-- INIT


main =
    Browser.document
        { init = init
        , view = \model -> { title = "RunApp2", body = view model |> Skeleton.layout (viewNavbar model) |> List.singleton }
        , update = update
        , subscriptions = subscriptions
        }


type Model
    = Loading (Maybe Date) (Maybe (List Activity))
    | Loaded State


type alias State =
    { calendar : Calendar.Model
    , store : Store.Model
    , activityForm : Maybe ActivityForm.Model
    , today : Date
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( Loading Nothing Nothing
    , Cmd.batch
        [ Task.perform Jump Date.today
        , Task.attempt GotActivities Api.getActivities
        ]
    )


viewNavbar : Model -> Html Msg
viewNavbar model =
    let
        header =
            compactColumn
                [ style "font-size" "1.5rem"
                , style "font-style" "italic"
                , style "color" "var(--header-blue)"
                , style "padding-top" "0.1rem"
                ]
                [ text "RunApp2" ]

        spinner =
            i
                [ class "fas fa-spinner"
                , style "font-size" "1.5rem"
                , style "color" "var(--icon-gray)"
                , style "animation" "rotation 2s infinite linear"
                ]
                []
    in
    case model of
        Loaded { store, calendar, today } ->
            row [ style "padding" "0.5rem" ]
                [ compactColumn [] [ Calendar.viewToggleButton calendar ]
                , column [] [ Calendar.viewDatePicker calendar (Jump today) ]
                , compactColumn [ style "min-width" "1.5rem", style "justify-content" "center" ]
                    [ viewIf (Store.needsFlush store) spinner
                    ]
                ]

        _ ->
            row [ style "padding" "0.5rem" ]
                [ header
                , column [] []
                , compactColumn [ style "justify-content" "center" ] [ spinner ]
                ]



-- UPDATING MODEL


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case model of
        Loading dateM activitiesM ->
            case msg of
                Jump date ->
                    Loading (Just date) activitiesM
                        |> updateLoading

                GotActivities activitiesR ->
                    case activitiesR of
                        Ok activities ->
                            Loading dateM (Just activities)
                                |> updateLoading

                        _ ->
                            ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        Loaded state ->
            case msg of
                LoadToday date ->
                    ( Loaded { state | today = date }
                    , Cmd.none
                    )

                GotActivities result ->
                    case result of
                        Ok activities ->
                            ( Loaded { state | store = Store.init activities }, Cmd.none )

                        _ ->
                            ( model, Cmd.none )

                ClickedNewActivity date ->
                    ( model, initActivity state.today (Just date) )

                NewActivity activity ->
                    updateStore (Create activity) { state | activityForm = Just <| ActivityForm.init activity } |> loaded

                EditActivity activity ->
                    ( Loaded { state | activityForm = Just <| ActivityForm.init activity }, Cmd.none )

                VisibilityChange visibility ->
                    case visibility of
                        "visible" ->
                            ( model, Cmd.batch [ Task.perform LoadToday Date.today, Task.attempt GotActivities Api.getActivities ] )

                        "hidden" ->
                            ( model, Store.flush state.store )

                        _ ->
                            ( model, Cmd.none )

                NoOp ->
                    ( model, Cmd.none )

                Create _ ->
                    updateStore msg { state | activityForm = Nothing } |> loaded

                Update _ ->
                    updateStore msg { state | activityForm = Nothing } |> loaded

                Move _ _ ->
                    updateStore msg { state | activityForm = Nothing } |> loaded

                Shift _ _ ->
                    updateStore msg state |> loaded

                Delete _ ->
                    updateStore msg state |> loaded

                Posted _ _ ->
                    updateStore msg state |> loaded

                DebounceFlush _ ->
                    updateStore msg state |> loaded

                Jump _ ->
                    updateCalendar msg state
                        |> loaded

                Toggle dateM ->
                    let
                        activityFormCmd =
                            Maybe.map2 ActivityForm.selectDate dateM state.activityForm
                                |> Maybe.map Store.cmd
                                |> Maybe.withDefault Cmd.none
                    in
                    updateCalendar msg state
                        |> loaded
                        |> Tuple.mapSecond (\cmd -> Cmd.batch [ cmd, activityFormCmd ])

                Scroll _ _ _ ->
                    updateCalendar msg state
                        |> loaded

                ScrollCompleted _ ->
                    updateCalendar msg state
                        |> loaded

                ReceiveSelectDate _ ->
                    updateCalendar msg state
                        |> loaded

                SelectedShape _ ->
                    updateActivityForm msg state
                        |> loaded

                EditedDescription _ ->
                    updateActivityForm msg state
                        |> loaded

                SelectedEmoji _ ->
                    updateActivityForm msg state
                        |> loaded

                CheckedCompleted _ ->
                    updateActivityForm msg state
                        |> loaded

                EditedDuration _ ->
                    updateActivityForm msg state
                        |> loaded

                SelectedPace _ ->
                    updateActivityForm msg state
                        |> loaded

                SelectedDistance _ ->
                    updateActivityForm msg state
                        |> loaded

                ClickedSubmit ->
                    updateActivityForm msg state
                        |> loaded

                ClickedDelete ->
                    updateActivityForm msg state
                        |> loaded

                ClickedCopy activity ->
                    ( model
                    , Activity.newId
                        |> Random.map (\id -> { activity | id = id })
                        |> Random.generate NewActivity
                    )

                ClickedMove ->
                    let
                        ( calendarState, calendarCmd ) =
                            updateCalendar (Toggle Nothing) state

                        ( activityFormState, activityFormCmd ) =
                            updateActivityForm msg calendarState
                    in
                    ( activityFormState, Cmd.batch [ calendarCmd, activityFormCmd ] )
                        |> loaded

                ClickedShift _ ->
                    updateActivityForm msg state
                        |> loaded

                NewId _ ->
                    updateActivityForm msg state
                        |> loaded


updateLoading : Model -> ( Model, Cmd Msg )
updateLoading model =
    case model of
        Loading (Just date) (Just activities) ->
            (Loaded <|
                State
                    (Calendar.init Calendar.Daily date)
                    (Store.init activities)
                    Nothing
                    date
            )
                |> update (Jump date)

        _ ->
            ( model, Cmd.none )


updateActivityForm : Msg -> State -> ( State, Cmd Msg )
updateActivityForm msg state =
    Maybe.map (ActivityForm.update msg) state.activityForm
        |> Maybe.map (Tuple.mapFirst (\activityForm -> { state | activityForm = Just activityForm }))
        |> Maybe.withDefault ( state, Cmd.none )


updateCalendar : Msg -> State -> ( State, Cmd Msg )
updateCalendar msg state =
    Calendar.update msg state.calendar
        |> Tuple.mapFirst (\calendar -> { state | calendar = calendar })


updateStore : Msg -> State -> ( State, Cmd Msg )
updateStore msg state =
    Store.update msg state.store
        |> Tuple.mapFirst (\store -> { state | store = store })


loaded : ( State, Cmd Msg ) -> ( Model, Cmd Msg )
loaded stateTuple =
    Tuple.mapFirst Loaded stateTuple


initActivity : Date -> Maybe Date -> Cmd Msg
initActivity today dateM =
    let
        date =
            dateM |> Maybe.withDefault today

        completed =
            Date.compare date today == LT || date == today
    in
    Activity.newId
        |> Random.map (\id -> Activity id date "" Nothing completed (Just 30) (Just Activity.Easy) Nothing)
        |> Random.generate NewActivity


calculateLevel : List Activity -> Maybe Int
calculateLevel activities =
    activities
        |> List.filterMap Activity.mprLevel
        |> List.reverse
        |> List.head



-- VIEW


view : Model -> Html Msg
view model =
    expandingRow
        [ id "home"
        , style "overflow" "hidden"
        ]
    <|
        case model of
            Loading _ _ ->
                [ text "Loading" ]

            Loaded state ->
                let
                    activities =
                        Store.get state.store .activities
                in
                [ Calendar.view state.calendar (ActivityForm.viewActivity state.activityForm (calculateLevel activities)) ClickedNewActivity state.today activities
                ]



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Time.every 10000 (\_ -> FlushStore)
        , Ports.selectDateFromScroll ReceiveSelectDate
        , Ports.visibilityChange VisibilityChange
        ]

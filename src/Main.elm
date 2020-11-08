module Main exposing (main)

import Activity exposing (Activity)
import ActivityForm
import ActivityShape
import Api
import Browser
import Browser.Dom as Dom
import Browser.Events as Events
import Calendar
import Date exposing (Date)
import Html exposing (Html, a, button, div, i, text)
import Html.Attributes exposing (attribute, class, href, id, style)
import Html.Events exposing (on, onClick)
import Html.Lazy
import Http
import Json.Decode as Decode
import Msg exposing (ActivityState(..), Msg(..))
import Ports
import Random
import Skeleton exposing (borderStyle, column, compactColumn, expandingRow, row, styleIf, viewIf, viewMaybe)
import Store
import Task exposing (Task)



-- INIT


main =
    Browser.document
        { init = init
        , view = \model -> { title = "RunApp2", body = [ Skeleton.layout (viewNavbar model) (view model) ] }
        , update = update
        , subscriptions = subscriptions
        }


type Model
    = Loading (Maybe Date) (Maybe (List Activity))
    | Loaded State
    | Error String


type State
    = State Calendar.Model Store.Model (Maybe ActivityForm.Model) ActivityState


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
        Loaded (State calendar store _ _) ->
            row [ style "padding" "0.5rem" ]
                [ column [] [ Calendar.viewMenu calendar ]
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

                        Err err ->
                            ( Error err, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        Error _ ->
            ( model, Cmd.none )

        Loaded state ->
            let
                (State calendar store formM activityM) =
                    state
            in
            case msg of
                GotActivities _ ->
                    updateStore msg state |> loaded

                VisibilityChange visibility ->
                    case visibility of
                        "visible" ->
                            ( model, Cmd.batch [ Task.perform LoadToday Date.today, Task.attempt GotActivities Api.getActivities ] )

                        "hidden" ->
                            ( model, Store.flush store )

                        _ ->
                            ( model, Cmd.none )

                KeyPressed key ->
                    if formM /= Nothing then
                        case key of
                            "Enter" ->
                                updateActivityForm ClickedSubmit state
                                    |> loaded

                            _ ->
                                ( model, Cmd.none )

                    else
                        ( model, Cmd.none )

                NoOp ->
                    ( model, Cmd.none )

                Create _ ->
                    updateStore msg (State calendar store Nothing None) |> loaded

                Update _ ->
                    updateStore msg (State calendar store Nothing None) |> loaded

                Move _ _ ->
                    updateStore msg state |> loaded

                Shift _ _ ->
                    updateStore msg state |> loaded

                Delete _ ->
                    updateStore msg (State calendar store Nothing None) |> loaded

                Posted _ _ ->
                    updateStore msg state |> loaded

                DebounceFlush _ ->
                    updateStore msg state |> loaded

                LoadToday date ->
                    updateCalendar msg state
                        |> loaded

                Jump _ ->
                    updateCalendar msg state
                        |> loaded

                ChangeZoom zoom dateM ->
                    let
                        ( calendarState, calendarCmd ) =
                            updateCalendar msg state

                        ( activityFormState, activityFormCmd ) =
                            updateActivityForm (Maybe.map SelectedDate dateM |> Maybe.withDefault NoOp) calendarState
                    in
                    ( activityFormState, Cmd.batch [ calendarCmd, activityFormCmd ] )
                        |> loaded

                Scroll _ _ _ ->
                    updateCalendar msg state
                        |> loaded

                ScrollCompleted _ ->
                    updateCalendar msg state
                        |> loaded

                ReceiveSelectDate _ ->
                    updateCalendar msg state
                        |> loaded

                ClickedNewActivity date ->
                    ( model, initActivity calendar.today (Just date) )

                NewActivity activity ->
                    updateStore (Create activity) (State calendar store (Just (ActivityForm.init activity)) (Editing activity))
                        |> loaded

                EditActivity activity ->
                    ( Loaded <| State calendar store (Just (ActivityForm.init activity)) (Editing activity), Cmd.none )

                SelectedDate _ ->
                    updateActivityForm msg state
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

                CheckedCompleted ->
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
                            updateCalendar (ChangeZoom Msg.Year Nothing) state

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
                    (Calendar.init Msg.Month date date)
                    (Store.init activities)
                    Nothing
                    None
            )
                |> update (Jump date)

        _ ->
            ( model, Cmd.none )


andThenUpdate : (State -> ( State, Cmd Msg )) -> ( State, Cmd Msg ) -> ( State, Cmd Msg )
andThenUpdate updateFunc ( state, cmd ) =
    updateFunc state
        |> Tuple.mapSecond (\cmd2 -> Cmd.batch [ cmd, cmd2 ])


updateActivityForm : Msg -> State -> ( State, Cmd Msg )
updateActivityForm msg (State calendar store formM activityM) =
    Maybe.map (ActivityForm.update msg) formM
        |> Maybe.map (Tuple.mapFirst (\updated -> State calendar store (Just updated) activityM))
        |> Maybe.withDefault ( State calendar store formM activityM, Cmd.none )


updateCalendar : Msg -> State -> ( State, Cmd Msg )
updateCalendar msg (State calendar store formM activityM) =
    Calendar.update msg calendar
        |> Tuple.mapFirst (\updated -> State updated store formM activityM)


updateStore : Msg -> State -> ( State, Cmd Msg )
updateStore msg (State calendar store formM activityM) =
    Store.update msg store
        |> Tuple.mapFirst (\updated -> State calendar updated formM activityM)


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
        |> Random.map (\id -> Activity id date "" (Activity.Run 30 Activity.Easy completed))
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
    expandingRow [ id "home", borderStyle "border-left", borderStyle "border-right" ]
        [ column [] <|
            case model of
                Loading _ _ ->
                    [ row [] [ text "Loading" ] ]

                Error errorString ->
                    [ row [] [ text errorString ] ]

                Loaded (State calendar store formM activityM) ->
                    let
                        activities =
                            Store.get store .activities

                        levelM =
                            calculateLevel activities
                    in
                    [ viewMaybe formM (ActivityForm.view levelM |> Html.Lazy.lazy)
                    , Html.Lazy.lazy Calendar.viewHeader calendar
                    , Html.Lazy.lazy3 Calendar.view
                        calendar
                        activities
                        activityM
                    ]
        ]



-- SUBSCRIPTIONS


keyPressDecoder =
    Decode.field "key" Decode.string
        |> Decode.map KeyPressed


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Ports.selectDateFromScroll ReceiveSelectDate
        , Ports.visibilityChange VisibilityChange
        , Events.onKeyPress keyPressDecoder
        ]

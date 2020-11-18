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
import Msg exposing (ActivityForm, ActivityState(..), Msg(..))
import Ports
import Random
import Skeleton exposing (borderStyle, column, compactColumn, expandingRow, row, spinner, styleIf, viewIf, viewMaybe)
import Store
import Task exposing (Task)
import Time



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
    = State Calendar.Model Store.Model ActivityState


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
    in
    case model of
        Loaded (State calendar store _) ->
            row [ style "padding" "0.5rem" ]
                [ column [] [ Calendar.viewMenu calendar ]
                , compactColumn [ style "min-width" "1.5rem", style "justify-content" "center" ]
                    [ viewIf (Store.needsFlush store) (spinner "1.5rem")
                    ]
                ]

        _ ->
            row [ style "padding" "0.5rem" ]
                [ header
                , column [] []
                , compactColumn [ style "justify-content" "center" ] [ spinner "1.5rem" ]
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
                (State calendar store activityM) =
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
                    case key of
                        "Enter" ->
                            updateActivityForm ClickedSubmit state
                                |> loaded

                        _ ->
                            ( model, Cmd.none )

                MouseMoved x y ->
                    let
                        newActivityM =
                            case activityM of
                                Moving activity _ _ ->
                                    Moving activity x y

                                _ ->
                                    activityM
                    in
                    ( Loaded (State calendar store newActivityM)
                    , Cmd.none
                    )

                AutoScrollCalendar y ->
                    let
                        distance =
                            50

                        navbarHeight =
                            50

                        autoScrollCalendar =
                            Dom.getViewportOf "calendar"
                                |> Task.andThen
                                    (\info ->
                                        if y < 0 then
                                            Task.succeed ()

                                        else if y > (info.viewport.height * 0.9 + navbarHeight) then
                                            Dom.setViewportOf "calendar" 0 (info.viewport.y + distance)

                                        else if y < (info.viewport.height * 0.1 + navbarHeight) then
                                            Dom.setViewportOf "calendar" 0 (info.viewport.y - distance)

                                        else
                                            Task.succeed ()
                                    )
                    in
                    ( model, Task.attempt (\_ -> NoOp) autoScrollCalendar )

                MouseReleased ->
                    let
                        newActivityM =
                            case activityM of
                                Moving activity _ _ ->
                                    Editing (ActivityForm.init activity)

                                _ ->
                                    activityM
                    in
                    ( Loaded (State calendar store newActivityM), Cmd.none )

                MoveTo date ->
                    case activityM of
                        Moving activity x y ->
                            if activity.date == date then
                                ( model, Cmd.none )

                            else
                                let
                                    newActivityM =
                                        Moving { activity | date = date } x y
                                in
                                updateStore (Move date activity) (State calendar store newActivityM) |> loaded

                        _ ->
                            ( model, Cmd.none )

                NoOp ->
                    ( model, Cmd.none )

                Create activity ->
                    updateStore msg (State calendar store (Selected activity)) |> loaded

                Update activity ->
                    updateStore msg (State calendar store (Selected activity)) |> loaded

                Move _ _ ->
                    updateStore msg state |> loaded

                Shift _ _ ->
                    updateStore msg state |> loaded

                Delete _ ->
                    updateStore msg (State calendar store None) |> loaded

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
                    ( model, initActivity (calendar |> Calendar.get |> .today) (Just date) )

                NewActivity activity ->
                    let
                        form =
                            ActivityForm.init activity
                    in
                    updateStore (Create activity) (State calendar store (Editing form))
                        |> loaded

                EditActivity activity ->
                    let
                        form =
                            ActivityForm.init activity
                    in
                    ( Loaded <| State calendar store (Editing form), Cmd.none )

                SelectActivity activity ->
                    ( Loaded <| State calendar store (Selected activity), Cmd.none )

                MoveActivity activity ->
                    ( Loaded <| State calendar store (Moving activity -100 -100), Cmd.none )

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
                    case activityM of
                        Editing form ->
                            updateActivityForm msg state
                                |> loaded

                        _ ->
                            ( Loaded (State calendar store None), Cmd.none )

                ClickedCopy activity ->
                    ( model
                    , Activity.newId
                        |> Random.map (\id -> { activity | id = id })
                        |> Random.generate NewActivity
                    )

                ClickedMove activity ->
                    let
                        ( calendarState, calendarCmd ) =
                            updateCalendar (ChangeZoom Msg.Year Nothing) (State calendar store (Editing (ActivityForm.initMove activity)))

                        ( activityFormState, activityFormCmd ) =
                            updateActivityForm msg calendarState
                    in
                    ( activityFormState, Cmd.batch [ calendarCmd, activityFormCmd ] )
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
updateActivityForm msg (State calendar store activityM) =
    let
        ( newActivityM, cmd ) =
            case activityM of
                Editing form ->
                    ActivityForm.update msg form |> Tuple.mapFirst Editing

                _ ->
                    ( activityM, Cmd.none )
    in
    ( State calendar store newActivityM, cmd )


updateCalendar : Msg -> State -> ( State, Cmd Msg )
updateCalendar msg (State calendar store activityM) =
    Calendar.update msg calendar
        |> Tuple.mapFirst (\updated -> State updated store activityM)


updateStore : Msg -> State -> ( State, Cmd Msg )
updateStore msg (State calendar store activityM) =
    Store.update msg store
        |> Tuple.mapFirst (\updated -> State calendar updated activityM)


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
    expandingRow
        [ id "home"
        , borderStyle "border-left"
        , borderStyle "border-right"
        ]
        [ case model of
            Loading _ _ ->
                column [] [ text "Loading" ]

            Error errorString ->
                column [] [ text errorString ]

            Loaded (State calendar store activityM) ->
                let
                    activities =
                        Store.get store .activities

                    levelM =
                        calculateLevel activities

                    events =
                        case activityM of
                            Moving _ _ _ ->
                                [ Html.Events.on "pointermove" mouseMoveDecoder
                                , Html.Events.on "pointerup" (Decode.succeed MouseReleased)
                                , class "no-touching"
                                ]

                            _ ->
                                []

                    activeId =
                        case activityM of
                            Selected { id } ->
                                id

                            Editing { id } ->
                                id

                            Moving { id } _ _ ->
                                id

                            None ->
                                ""
                in
                column (style "position" "relative" :: events)
                    [ Html.Lazy.lazy Calendar.viewHeader calendar
                    , Html.Lazy.lazy3 Calendar.view calendar activities activeId
                    , Html.Lazy.lazy viewActivityM activityM
                    ]
        ]


viewActivityM : ActivityState -> Html Msg
viewActivityM activityState =
    case activityState of
        Editing form ->
            ActivityForm.view Nothing (Just form)

        Moving activity x y ->
            row
                [ style "position" "fixed"
                , style "left" (String.fromFloat x ++ "px")
                , style "top" (String.fromFloat y ++ "px")
                , style "z-index" "3"
                ]
                [ compactColumn [ style "flex-basis" "5rem" ]
                    [ ActivityShape.view activity ]
                ]

        _ ->
            Html.text ""


mouseMoveDecoder =
    Decode.map2 MouseMoved
        (Decode.field "x" Decode.float)
        (Decode.field "y" Decode.float)



-- SUBSCRIPTIONS


keyPressDecoder =
    Decode.field "key" Decode.string
        |> Decode.map KeyPressed


subscriptions : Model -> Sub Msg
subscriptions model =
    case model of
        Loaded (State _ _ activityM) ->
            Sub.batch
                [ Ports.selectDateFromScroll ReceiveSelectDate
                , Ports.visibilityChange VisibilityChange
                , case activityM of
                    Editing form ->
                        Events.onKeyPress keyPressDecoder

                    Selected form ->
                        Events.onKeyPress keyPressDecoder

                    Moving activity x y ->
                        Time.every 100 (\_ -> AutoScrollCalendar y)

                    _ ->
                        Sub.none
                ]

        _ ->
            Sub.none

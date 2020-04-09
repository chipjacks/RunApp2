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
import Skeleton exposing (column, compactColumn, expandingRow, row, styleIf)
import Store
import Task
import Time exposing (Month(..))
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), (<?>))
import Url.Parser.Query as Query



-- INIT


main =
    Browser.document
        { init = init
        , view = \model -> { title = "RunApp2", body = view model |> Skeleton.layout (isPersisting model) |> List.singleton }
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


isPersisting : Model -> Bool
isPersisting model =
    case model of
        Loaded { store } ->
            Store.needsFlush store

        _ ->
            False



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
                LoadToday ->
                    ( model
                    , Task.perform Jump Date.today
                    )

                GotActivities result ->
                    case result of
                        Ok activities ->
                            ( Loaded { state | store = Store.init activities }, Cmd.none )

                        _ ->
                            ( model, Cmd.none )

                EditActivity activity ->
                    ( Loaded { state | activityForm = Just <| ActivityForm.initEdit activity }, Cmd.none )

                NewActivity dateM ->
                    let
                        date =
                            dateM |> Maybe.withDefault (Calendar.getDate state.calendar)

                        completed =
                            Date.compare date state.today == LT || date == state.today
                    in
                    ( Loaded { state | activityForm = Just <| ActivityForm.initNew "fakeid" (Just date) completed }
                    , ActivityForm.generateNewId
                    )

                NoOp ->
                    ( model, Cmd.none )

                Create _ ->
                    ( Loaded { state | store = Store.update msg state.store }, Cmd.none )

                Update _ ->
                    ( Loaded { state | store = Store.update msg state.store }, Cmd.none )

                Shift _ _ ->
                    ( Loaded { state | store = Store.update msg state.store }, Cmd.none )

                Delete _ ->
                    ( Loaded { state | store = Store.update msg state.store }, Cmd.none )

                Posted _ _ ->
                    ( Loaded { state | store = Store.update msg state.store }, Cmd.none )

                FlushStore ->
                    ( model, Store.flush state.store )

                Jump date ->
                    ( Loaded { state | calendar = Calendar.update msg state.calendar, activityForm = Maybe.map (ActivityForm.selectDate date) state.activityForm }, Cmd.none )

                Toggle ->
                    ( Loaded { state | calendar = Calendar.update msg state.calendar }, Cmd.none )

                SelectedShape _ ->
                    updateActivityForm msg state

                EditedDescription _ ->
                    updateActivityForm msg state

                CheckedCompleted _ ->
                    updateActivityForm msg state

                EditedDuration _ ->
                    updateActivityForm msg state

                SelectedPace _ ->
                    updateActivityForm msg state

                SelectedDistance _ ->
                    updateActivityForm msg state

                ClickedSubmit ->
                    updateActivityForm msg state

                ClickedDelete ->
                    updateActivityForm msg state

                ClickedMove ->
                    ( Loaded { state | calendar = Calendar.weekly state.calendar }, Cmd.none )

                ClickedShift _ ->
                    updateActivityForm msg state

                NewId _ ->
                    updateActivityForm msg state


updateLoading : Model -> ( Model, Cmd Msg )
updateLoading model =
    case model of
        Loading (Just date) (Just activities) ->
            (Loaded <|
                State
                    (Calendar.init date)
                    (Store.init activities)
                    Nothing
                    date
            )
                |> update NoOp

        _ ->
            ( model, Cmd.none )


updateActivityForm : Msg -> State -> ( Model, Cmd Msg )
updateActivityForm msg state =
    Maybe.map (ActivityForm.update msg) state.activityForm
        |> Maybe.map (Tuple.mapFirst (\af -> Loaded { state | activityForm = Just af }))
        |> Maybe.withDefault ( Loaded state, Cmd.none )



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
                [ Calendar.view state.calendar (\_ -> Html.text "") Calendar.Jump state.today (Store.get state.store .activities)
                    |> Html.map CalendarMsg
                ]


viewActivity : Maybe ActivityForm.Model -> Activity -> Html Msg
viewActivity activityFormM activity =
    let
        level =
            Activity.mprLevel activity
                |> Maybe.map (\l -> "level " ++ String.fromInt l)
                |> Maybe.withDefault ""

        activityView =
            a [ onClick (EditActivity activity) ]
                [ row [ style "margin-bottom" "1rem" ]
                    [ compactColumn [ style "flex-basis" "5rem" ] [ ActivityShape.view activity ]
                    , column [ style "justify-content" "center" ]
                        [ row [] [ text activity.description ]
                        , row [ style "font-size" "0.8rem" ]
                            [ column [] [ text <| String.fromInt activity.duration ++ " min " ++ (Maybe.map Activity.pace.toString activity.pace |> Maybe.withDefault "" |> String.toLower) ]
                            , compactColumn [ style "align-items" "flex-end" ] [ text level ]
                            ]
                        ]
                    ]
                ]
    in
    case activityFormM of
        Just af ->
            if ActivityForm.isEditing activity af then
                ActivityForm.view af |> Html.map ActivityFormMsg

            else
                activityView

        Nothing ->
            activityView



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Time.every 10000 (\_ -> FlushStore)

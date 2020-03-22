module Store exposing (Model, Msg(..), cmd, flush, get, init, update)

import Activity exposing (Activity)
import Api
import Http
import Task exposing (Task)


type Model
    = Model State (List Msg)


type alias State =
    { activities : List Activity }


type Msg
    = Create Activity
    | Update Activity
    | Shift Bool Activity
    | Delete Activity
    | NoOp
    | Posted (Result Http.Error (List Activity))


init : List Activity -> Model
init activities =
    Model (State activities) []


get : Model -> (State -> b) -> b
get (Model state _) f =
    f state


cmd : Msg -> Cmd Msg
cmd msg =
    Task.perform (\_ -> msg) (Task.succeed ())


updateState : Msg -> State -> State
updateState msg state =
    case msg of
        Create activity ->
            { state | activities = updateActivity activity True state.activities }

        Update activity ->
            { state | activities = updateActivity activity False state.activities }

        Shift up activity ->
            { state | activities = shiftActivity activity up state.activities }

        Delete activity ->
            { state | activities = List.filter (\a -> a.id /= activity.id) state.activities }

        _ ->
            state


update : Msg -> Model -> Model
update msg model =
    case msg of
        Posted result ->
            case model of
                Model state msgs ->
                    Model state []

        _ ->
            case model of
                Model state msgs ->
                    Model (updateState msg state) (msg :: msgs)


flush : Model -> Cmd Msg
flush model =
    case model of
        Model state [] ->
            Cmd.none

        Model state msgs ->
            Api.getActivities
                |> Task.map State
                |> Task.map (\remoteState -> List.foldr (\msg rs -> updateState msg rs) remoteState msgs)
                |> Task.andThen (\newRemoteState -> Api.postActivities newRemoteState.activities)
                |> Task.attempt Posted


updateActivity : Activity -> Bool -> List Activity -> List Activity
updateActivity activity isNew activities =
    if isNew then
        List.append activities [ activity ]

    else
        List.map
            (\existing ->
                if existing.id == activity.id then
                    activity

                else
                    existing
            )
            activities


shiftActivity : Activity -> Bool -> List Activity -> List Activity
shiftActivity activity moveUp activities =
    case activities of
        a :: b :: tail ->
            if a.id == activity.id then
                if moveUp then
                    activities

                else
                    b :: a :: tail

            else if b.id == activity.id then
                if moveUp then
                    b :: a :: tail

                else
                    a :: shiftActivity activity moveUp (b :: tail)

            else
                a :: shiftActivity activity moveUp (b :: tail)

        _ ->
            activities

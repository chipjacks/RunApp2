module Store exposing (Model, cmd, flush, get, init, needsFlush, update)

import Activity exposing (Activity)
import Api
import Date exposing (Date)
import Http
import Msg exposing (Msg(..))
import Task exposing (Task)


type Model
    = Model State (List Msg)


type alias State =
    { activities : List Activity }


init : List Activity -> Model
init activities =
    Model (State activities) []


get : Model -> (State -> b) -> b
get (Model state _) f =
    f state


cmd : Msg -> Cmd Msg
cmd msg =
    Task.perform (\_ -> msg) (Task.succeed ())


needsFlush : Model -> Bool
needsFlush (Model _ msgs) =
    not (List.isEmpty msgs)


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
        Posted sentMsgs result ->
            case model of
                Model state msgs ->
                    Model state (List.take (List.length msgs - List.length sentMsgs) msgs)

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
                |> Task.attempt (Posted msgs)


updateActivity : Activity -> Bool -> List Activity -> List Activity
updateActivity activity isNew activities =
    if isNew then
        List.partition (\a -> Date.compare a.date activity.date == GT) activities
            |> (\( after, before ) -> List.concat [ before, [ activity ], after ])

    else
        List.filter (\a -> a.id /= activity.id) activities
            |> updateActivity activity True


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

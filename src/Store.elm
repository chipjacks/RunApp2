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

        Move date activity ->
            { state | activities = moveActivity activity date state.activities }

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
        List.map
            (\existing ->
                if existing.id == activity.id then
                    activity

                else
                    existing
            )
            activities


moveActivity : Activity -> Date -> List Activity -> List Activity
moveActivity activity toDate activities =
    updateActivity { activity | date = toDate } True (List.filter (\a -> a.id /= activity.id) activities)


shiftActivity : Activity -> Bool -> List Activity -> List Activity
shiftActivity activity moveUp activities =
    let
        before =
            List.filter (\a -> Date.compare a.date activity.date == LT) activities

        on =
            List.filter (\a -> a.date == activity.date) activities

        after =
            List.filter (\a -> Date.compare a.date activity.date == GT) activities
    in
    if moveUp then
        List.concat [ before, shiftUp activity.id on, after ]

    else
        List.concat [ before, shiftUp activity.id (List.reverse on) |> List.reverse, after ]


shiftUp : Activity.Id -> List Activity -> List Activity
shiftUp id activities =
    case activities of
        a :: b :: tail ->
            if a.id == id then
                activities

            else if b.id == id then
                b :: a :: tail

            else
                a :: shiftUp id (b :: tail)

        _ ->
            activities

module Msg exposing (Msg(..))

import Activity exposing (Activity)
import Browser.Dom as Dom
import Date exposing (Date)
import Http


type Msg
    = LoadToday
    | GotActivities (Result Http.Error (List Activity))
    | EditActivity Activity
    | ReceiveSelectDate String
    | NoOp
      -- STORE
    | Create Activity
    | Update Activity
    | Move Date Activity
    | Shift Bool Activity
    | Delete Activity
    | Posted (List Msg) (Result Http.Error (List Activity))
    | FlushStore
      -- CALENDAR
    | Jump Date
    | Toggle (Maybe Date)
    | Scroll Bool Date Int
    | ScrollCompleted (Result Dom.Error Dom.Element)
      -- ACTIVITY FORM
    | ClickedNewActivity Date
    | NewActivity Activity
    | SelectedShape Activity.ActivityType
    | EditedDescription String
    | CheckedCompleted Bool
    | EditedDuration String
    | SelectedPace String
    | SelectedDistance String
    | ClickedSubmit
    | ClickedDelete
    | ClickedCopy Activity
    | ClickedMove
    | ClickedShift Bool
    | NewId String

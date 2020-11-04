module Msg exposing (Msg(..), Zoom(..))

import Activity exposing (Activity)
import Browser.Dom as Dom
import Date exposing (Date)
import Http


type Zoom
    = Year
    | Month
    | Day


type Msg
    = LoadToday Date
    | GotActivities (Result String (List Activity))
    | EditActivity Activity
    | ReceiveSelectDate String
    | VisibilityChange String
    | KeyPressed String
    | NoOp
      -- STORE
    | Create Activity
    | Update Activity
    | Move Date Activity
    | Shift Bool Activity
    | Delete Activity
    | Posted (List Msg) (Result String (List Activity))
    | DebounceFlush Int
      -- CALENDAR
    | Jump Date
    | ChangeZoom Zoom (Maybe Date)
    | Scroll Bool Date Int
    | ScrollCompleted (Result Dom.Error Dom.Element)
      -- ACTIVITY FORM
    | ClickedNewActivity Date
    | NewActivity Activity
    | SelectedShape Activity.ActivityData
    | EditedDescription String
    | SelectedEmoji String
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

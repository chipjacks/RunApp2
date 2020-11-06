module Msg exposing (DataForm(..), Msg(..), Zoom(..))

import Activity exposing (Activity)
import Array exposing (Array)
import Browser.Dom as Dom
import Date exposing (Date)
import Http


type Zoom
    = Year
    | Month
    | Day


type DataForm
    = RunForm { duration : String, pace : Activity.Pace, completed : Bool }
    | WorkoutForm { selected : Int, intervals : Array Activity.Interval, completed : Bool }
    | RaceForm { duration : String, distance : Activity.Distance, completed : Bool }
    | OtherForm { duration : String, completed : Bool }
    | NoteForm { emoji : String }


type Msg
    = LoadToday Date
    | GotActivities (Result String (List Activity))
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
    | EditActivity Activity
    | SelectedDate Date
    | SelectedShape Activity.ActivityData
    | EditedDescription String
    | SelectedEmoji String
    | CheckedCompleted
    | EditedDuration String
    | SelectedPace String
    | SelectedDistance String
    | ClickedSubmit
    | ClickedDelete
    | ClickedCopy Activity
    | ClickedMove
    | ClickedShift Bool
    | NewId String

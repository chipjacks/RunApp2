module Msg exposing (ActivityForm, ActivityState(..), DataForm(..), FormError(..), Msg(..), Zoom(..))

import Activity exposing (Activity)
import Browser.Dom as Dom
import Date exposing (Date)
import Http


type Zoom
    = Year
    | Month
    | Day


type alias ActivityForm =
    { id : Activity.Id
    , date : Maybe Date
    , description : String
    , result : Result FormError Activity
    , dataForm : DataForm
    }


type FormError
    = ApiError
    | EmptyFieldError String


type DataForm
    = RunForm { duration : String, pace : Activity.Pace, completed : Bool }
    | RaceForm { duration : String, distance : Activity.Distance, completed : Bool }
    | OtherForm { duration : String, completed : Bool }
    | NoteForm { emoji : String }


type ActivityState
    = Selected Activity
    | Editing ActivityForm
    | Moving Activity Float Float
    | None


type Msg
    = LoadToday Date
    | GotActivities (Result String (List Activity))
    | VisibilityChange String
    | KeyPressed String
    | MouseMoved Float Float
    | MouseReleased
    | MoveTo Date
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
    | ReceiveSelectDate String
    | MoveActivity Activity
      -- ACTIVITY FORM
    | ClickedNewActivity Date
    | NewActivity Activity
    | SelectActivity Activity
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
    | ClickedCopy Activity
    | ClickedMove Activity
    | NewId String

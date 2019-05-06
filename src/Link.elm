module Link exposing (toActivity, toCalendar)

import Activity
import Date exposing (Date)
import Url.Builder exposing (absolute, string)


toCalendar : String
toCalendar =
    absolute [ "home" ] []


toActivity : Activity.Id -> String
toActivity id =
    absolute [ "home" ] [ string "activity" id ]

module Link exposing (toActivity, toCalendar, toNewActivity, toCalendarDate)

import Activity
import Date exposing (Date)
import Url.Builder exposing (absolute, string)


toCalendar : String
toCalendar =
    absolute [ "calendar" ] []


toCalendarDate : Date -> String
toCalendarDate date =
    absolute [ "calendar" ] [ string "date" (Date.toIsoString date) ]


toActivity : Activity.Id -> String
toActivity id =
    absolute [ "activity", id ] [ ]


toNewActivity : Date -> String
toNewActivity date =
    absolute [ "activity", "new" ] [ string "date" (Date.toIsoString date) ]

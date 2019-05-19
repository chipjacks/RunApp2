module Link exposing (toActivity, toDailyCalendar, toNewActivity, toWeeklyCalendar)

import Activity
import Date exposing (Date)
import Url.Builder exposing (absolute, string)


toWeeklyCalendar : Date -> String
toWeeklyCalendar date =
    absolute [ "calendar", "weekly" ] [ string "date" (Date.toIsoString date) ]


toDailyCalendar : Date -> String
toDailyCalendar date =
    absolute [ "calendar", "daily" ] [ string "date" (Date.toIsoString date) ]


toActivity : Activity.Id -> String
toActivity id =
    absolute [ "activity", id ] []


toNewActivity : Date -> String
toNewActivity date =
    absolute [ "activity", "new" ] [ string "date" (Date.toIsoString date) ]

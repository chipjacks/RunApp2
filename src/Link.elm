module Link exposing (toActivity, toDailyCalendar, toNewActivity, toWeeklyCalendar)

import Activity
import Date exposing (Date)
import Url.Builder exposing (absolute, string)


toWeeklyCalendar : Date -> String
toWeeklyCalendar date =
    absolute [ "calendar", "weekly" ] [ string "date" (Date.toIsoString date) ]
        |> toFragment


toDailyCalendar : Date -> String
toDailyCalendar date =
    absolute [ "calendar", "daily" ] [ string "date" (Date.toIsoString date) ]
        |> toFragment


toActivity : Activity.Id -> String
toActivity id =
    absolute [ "activity", id ] []
        |> toFragment


toNewActivity : Date -> String
toNewActivity date =
    absolute [ "activity", "new" ] [ string "date" (Date.toIsoString date) ]
        |> toFragment


toFragment : String -> String
toFragment absUrl =
    String.dropLeft 1 absUrl
        |> String.append "#"

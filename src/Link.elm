module Link exposing (toActivity, toCalendar)

import Activity
import Date exposing (Date)
import Url.Builder exposing (absolute, string)


toCalendar : Maybe Date -> String
toCalendar dateM =
    case dateM of
        Just date ->
            absolute [ "home" ] [ string "date" (Date.toIsoString date) ]

        Nothing ->
            absolute [ "home" ] []


toActivity : Activity.Id -> String
toActivity id =
    absolute [ "home" ] [ string "activity" id ]

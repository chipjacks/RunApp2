module Link exposing (toActivity, toCalendar)

import Activity
import Date exposing (Date)
import Url.Builder exposing (absolute, string)


toCalendar : Maybe Date -> String
toCalendar dateM =
    case dateM of
        Just date ->
            absolute [ "calendar" ] [ string "date" (Date.toIsoString date) ]

        Nothing ->
            absolute [ "calendar" ] []


toActivity : Maybe Activity.Id -> String
toActivity idM =
    case idM of
        Just id ->
            absolute [ "activity" ] [ string "id" id ]

        Nothing ->
            absolute [ "activity" ] []

module Link exposing (toActivityList, toCalendar)

import Date exposing (Date)
import Url.Builder exposing (absolute, string)


toCalendar : Maybe Date -> String
toCalendar dateM =
    case dateM of
        Just date ->
            absolute [ "calendar" ] [ string "date" (Date.toIsoString date) ]

        Nothing ->
            absolute [ "calendar" ] []


toActivityList : Maybe Date -> String
toActivityList dateM =
    case dateM of
        Just date ->
            absolute [ "activities" ] [ string "date" (Date.toIsoString date) ]

        Nothing ->
            absolute [ "activities" ] []

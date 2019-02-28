module Link exposing (toActivityList, toCalendar)

import Date exposing (Date)
import Url.Builder exposing (absolute, int)


toCalendar : Maybe Date -> String
toCalendar dateM =
    case dateM of
        Just date ->
            absolute [ "calendar" ] [ int "date" (Date.toRataDie date) ]

        Nothing ->
            absolute [ "calendar" ] []


toActivityList : Maybe Date -> String
toActivityList dateM =
    case dateM of
        Just date ->
            absolute [ "activities" ] [ int "date" (Date.toRataDie date) ]

        Nothing ->
            absolute [ "activities" ] []

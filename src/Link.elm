module Link exposing (toBlockList, toCalendar)

import Date exposing (Date)
import Url.Builder exposing (absolute, int)


toCalendar : Maybe Date -> String
toCalendar dateM =
    case dateM of
        Just date ->
            absolute [ "calendar" ] [ int "date" (Date.toRataDie date) ]

        Nothing ->
            absolute [ "calendar" ] []


toBlockList : Maybe Date -> String
toBlockList dateM =
    case dateM of
        Just date ->
            absolute [ "blocks" ] [ int "date" (Date.toRataDie date) ]

        Nothing ->
            absolute [ "blocks" ] []

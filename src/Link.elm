module Link exposing (toBlockList, toCalendar)

import Date exposing (Date)
import Url.Builder exposing (absolute, int)


{-| Build a URL for the calendar page

    import Date

    toCalendar (Date.fromRataDie 123)
    --> "/calendar?date=123"

-}
toCalendar : Maybe Date -> String
toCalendar dateM =
    case dateM of
        Just date ->
            absolute [ "calendar" ] [ int "date" (Date.toRataDie date) ]

        Nothing ->
            absolute [ "calendar" ] []


{-| Build a URL for the blocklist page

    import Date

    toBlockList (Date.fromRataDie 123)
    --> "/blocks?date=123"

-}
toBlockList : Maybe Date -> String
toBlockList dateM =
    case dateM of
        Just date ->
            absolute [ "blocks" ] [ int "date" (Date.toRataDie date) ]

        Nothing ->
            absolute [ "blocks" ] []

module Link exposing (toBlockList, toCalendar)

import Date exposing (Date)
import Url.Builder exposing (absolute, int)


{-| Build a URL for the calendar page

    import Date

    toCalendar (Date.fromRataDie 123)
    --> "/calendar?date=123"

-}
toCalendar : Date -> String
toCalendar date =
    absolute [ "calendar" ] [ int "date" (Date.toRataDie date) ]


{-| Build a URL for the blocklist page

    import Date

    toBlockList (Date.fromRataDie 123)
    --> "/blocks?date=123"

-}
toBlockList : Date -> String
toBlockList date =
    absolute [ "blocks" ] [ int "date" (Date.toRataDie date) ]

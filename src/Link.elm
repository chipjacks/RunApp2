module Link exposing (toBlockList, toCalendar)

import Html exposing (Attribute)
import Url.Builder exposing (absolute, int)


toCalendar : { date : Int } -> String
toCalendar args =
    absolute [ "calendar" ] [ int "date" args.date ]


toBlockList : { date : Int } -> String
toBlockList args =
    absolute [ "blocks" ] [ int "date" args.date ]

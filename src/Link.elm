module Link exposing (toBlockList, toCalendar)

import Html exposing (Attribute)
import Url.Builder exposing (absolute, string)


toCalendar : { date : String } -> String
toCalendar args =
    absolute [ "calendar" ] [ string "date" args.date ]


toBlockList : { date : String } -> String
toBlockList args =
    absolute [ "blocks" ] [ string "date" args.date ]

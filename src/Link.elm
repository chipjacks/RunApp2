module Link exposing (toActivity, toNewActivity)

import Activity
import Date exposing (Date)
import Url.Builder exposing (absolute, string)


toActivity : Activity.Id -> String
toActivity id =
    absolute [ "activity", id ] []


toNewActivity : Date -> String
toNewActivity date =
    absolute [ "activity", "new" ] [ string "date" (Date.toIsoString date) ]

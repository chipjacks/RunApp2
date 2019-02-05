module BlockList exposing (view)

import Date exposing (Date)
import Element exposing (Element, column, link, text)
import Link


view : Date -> Element msg
view date =
    column []
        [ text ("Blocks " ++ Date.toIsoString date)
        , link []
            { url = Link.toCalendar date
            , label = text "Calendar"
            }
        ]

module BlockList exposing (view)

import Date exposing (Date)
import Element exposing (Element, column, fill, link, text, width)
import Element.Region exposing (description)
import Link


view : Date -> Element msg
view date =
    column [ width fill, description "blocks" ]
        [ text ("Blocks " ++ Date.toIsoString date)
        , link []
            { url = Link.toCalendar date
            , label = text "Calendar"
            }
        ]

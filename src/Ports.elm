port module Ports exposing (scrollToSelectedDate, selectDateFromScroll, visibilityChange)

import Msg exposing (Msg(..))


port scrollToSelectedDate : () -> Cmd msg


port selectDateFromScroll : (String -> msg) -> Sub msg


port visibilityChange : (String -> msg) -> Sub msg

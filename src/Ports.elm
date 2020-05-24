port module Ports exposing (scrollToSelectedDate, selectDateFromScroll)

import Msg exposing (Msg(..))


port scrollToSelectedDate : () -> Cmd msg


port selectDateFromScroll : (String -> msg) -> Sub msg

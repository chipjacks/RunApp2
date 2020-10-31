port module Ports exposing (scrollToSelectedDate, selectDateFromScroll, visibilityChange)

port scrollToSelectedDate : () -> Cmd msg


port selectDateFromScroll : (String -> msg) -> Sub msg


port visibilityChange : (String -> msg) -> Sub msg

port module Ports exposing (scrollCalendarBy, scrollToSelectedDate, selectDateFromScroll, visibilityChange)


port scrollToSelectedDate : () -> Cmd msg


port scrollCalendarBy : Int -> Cmd msg


port selectDateFromScroll : (String -> msg) -> Sub msg


port visibilityChange : (String -> msg) -> Sub msg

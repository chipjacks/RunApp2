module Scroll exposing (config, on, reset)

import Browser.Dom as Dom
import Html exposing (Attribute)
import Html.Events
import Json.Decode as Decode
import Task


config =
    { marginBottom = "-500px"
    , center = 250
    , loadPrevious = 10
    , loadNext = 490
    }


on : (Int -> msg) -> Html.Attribute msg
on msg =
    Html.Events.on "scroll"
        (Decode.at [ "target", "scrollTop" ] Decode.int
            |> Decode.map msg
        )


reset : (Int -> msg) -> String -> Cmd msg
reset scrollMsg id =
    Task.attempt
        (\_ -> scrollMsg config.center)
        (Dom.setViewportOf id 0 config.center)

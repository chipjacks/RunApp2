module Skeleton exposing (view)

import Browser
import Html exposing (Html)


view : String -> Html msg -> Browser.Document msg
view title body =
    { title = title
    , body = [ body ]
    }

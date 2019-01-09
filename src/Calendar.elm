module Calendar exposing (view)

import Html exposing (Html)
import Html.Attributes
import Url.Builder


view : Html msg
view =
    Html.div [] [ Html.text "Calendar", Html.a [ Html.Attributes.href (Url.Builder.absolute [ "blocks" ] []) ] [ Html.text "Blocks" ] ]

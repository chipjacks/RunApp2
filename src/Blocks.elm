module Blocks exposing (Model, Msg, init, update, urlParser, view)

import Html exposing (Html)
import Html.Attributes
import Url.Builder
import Url.Parser exposing (Parser, custom)


type alias Model =
    { blocks : String
    }


type Msg
    = NoOp


urlParser : Parser (Model -> a) a
urlParser =
    custom "BLOCKS" <|
        \segment ->
            Just (Model segment)


init : Model
init =
    Model "block"


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )


view : Model -> Html msg
view model =
    Html.div [] [ Html.text ("Blocks " ++ model.blocks), Html.a [ Html.Attributes.href (Url.Builder.absolute [ "calendar", "yesterday" ] []) ] [ Html.text "Calendar" ] ]

module Calendar exposing (Model, Msg, init, update, urlParser, view)

import Html exposing (Html)
import Html.Attributes
import Url.Builder
import Url.Parser exposing (Parser, custom)


type alias Model =
    { date : String
    }


type Msg
    = NoOp


urlParser : Parser (Model -> a) a
urlParser =
    custom "CALENDAR" <|
        \segment ->
            Just (Model segment)


init : Model
init =
    Model "today"


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )


view : Model -> Html msg
view model =
    Html.div [] [ Html.text ("Calendar " ++ model.date), Html.a [ Html.Attributes.href (Url.Builder.absolute [ "blocks", "block" ] []) ] [ Html.text "Blocks" ] ]

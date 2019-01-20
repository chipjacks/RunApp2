module Calendar exposing (Model, Msg, init, update, urlBuilder, urlParser, view)

import Html exposing (Html)
import Html.Attributes exposing (href)
import Link
import Url.Parser.Query as Query


type alias Model =
    { date : String
    }


type Msg
    = NoOp


urlBuilder : Model -> String
urlBuilder model =
    Link.toCalendar model


urlParser : Query.Parser (Maybe Model)
urlParser =
    Query.map
        (Maybe.map Model)
        (Query.string "date")


init : Model
init =
    Model "today"


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )


view : Model -> Html msg
view model =
    Html.div []
        [ Html.text ("Calendar " ++ model.date)
        , Html.a [ Link.toBlockList { date = "1/19/2019" } |> href ]
            [ Html.text "Blocks" ]
        ]

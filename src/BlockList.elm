module BlockList exposing (Model, Msg, init, update, urlBuilder, urlParser, view)

import Html exposing (Html)
import Html.Attributes exposing (href)
import Link
import Url.Parser.Query as Query



{-
   ### VIEW: List Blocks By Date

       ...

       Mon, Jan 21
         BLOCK DESCRIPTION
         BLOCK DESCRIPTION

       Tue, Jan 22
         BLOCK DESCRIPTION

       ...

   ### UPDATE

       - Request blocks from cache by date
       - Load more dates on scroll
       - Open block on click
       - Return to calendar

-}
-- TODO: install Date


type Model
    = Model String


type Msg
    = NoOp



-- DECODE


urlParser : Query.Parser (Maybe Model)
urlParser =
    Query.map
        (Maybe.map Model)
        (Query.string "date")



-- ENCODE


urlBuilder : Model -> String
urlBuilder model =
    case model of
        Model str ->
            Link.toBlockList { date = str }


init : Model
init =
    Model "Saturday, January 19th"


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )


view : Model -> Html msg
view model =
    Html.div []
        [ Html.text ("Blocks " ++ currentDate model)
        , Html.a [ Link.toCalendar { date = "yesterday" } |> href ]
            [ Html.text "Calendar" ]
        ]



-- INTERNAL


currentDate : Model -> String
currentDate model =
    case model of
        Model current ->
            current

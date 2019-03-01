module Main exposing (main)

import Browser
import Browser.Events
import Browser.Navigation as Nav
import Date
import Home
import Html
import Skeleton
import Url
import Url.Parser as Parser exposing ((<?>))
import Url.Parser.Query as Query
import Window exposing (Window)



-- MODEL


type alias Model =
    { key : Nav.Key
    , page : Page
    }


type Page
    = Home Home.Model
    | NotFound



-- INIT


main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlRequest = LinkClicked
        , onUrlChange = parseUrl
        }


type alias Flags =
    { window : Window
    }


init : Flags -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url key =
    update
        (parseUrl url)
        { key = key, page = Home (Home.init flags.window) }



-- UPDATE


type Msg
    = LinkClicked Browser.UrlRequest
    | HomeMsg Home.Msg
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model.page ) of
        ( HomeMsg subMsg, Home subModel ) ->
            Home.update subMsg subModel
                |> Tuple.mapBoth
                    (\cmodel -> { model | page = Home cmodel })
                    (\cmsg -> Cmd.map HomeMsg cmsg)

        ( LinkClicked urlRequest, _ ) ->
            case urlRequest of
                Browser.Internal url ->
                    ( model
                    , Nav.pushUrl model.key (Url.toString url)
                    )

                Browser.External href ->
                    ( model
                    , Nav.load href
                    )

        ( _, _ ) ->
            ( model, Cmd.none )


parseUrl : Url.Url -> Msg
parseUrl url =
    Parser.oneOf
        [ Parser.map
            (\rataDieM -> HomeMsg <| Home.openCalendar (Maybe.map Date.fromRataDie rataDieM))
            (Parser.s "calendar" <?> Query.int "date")
        , Parser.map
            (\rataDieM -> HomeMsg <| Home.openActivityList (Maybe.map Date.fromRataDie rataDieM))
            (Parser.s "activities" <?> Query.int "date")
        , Parser.map (HomeMsg <| Home.openCalendar Nothing) Parser.top
        ]
        |> (\parser -> Parser.parse parser url)
        |> Maybe.withDefault NoOp



-- VIEW


view : Model -> Browser.Document Msg
view model =
    case model.page of
        NotFound ->
            { title = "Not Found"
            , body = [ Html.div [] [ Html.text "Page Not Found" ] ]
            }

        Home subModel ->
            { title = "Home"
            , body = Home.view subModel |> Skeleton.layout |> Html.map HomeMsg |> List.singleton
            }



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Browser.Events.onResize (\w h -> HomeMsg (Home.resizeWindow w h))

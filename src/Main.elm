module Main exposing (main)

import Blocks
import Browser
import Browser.Navigation as Nav
import Calendar
import Html
import Skeleton
import Url
import Url.Parser as Parser exposing ((</>), Parser, oneOf, s, top)


main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlRequest = LinkClicked
        , onUrlChange = UrlChanged
        }



-- MODEL


type alias Model =
    { key : Nav.Key
    , page : Page
    }


type Page
    = NotFound
    | Calendar Calendar.Model
    | Blocks Blocks.Model



-- INIT


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    updateUrl url
        { key = key
        , page = NotFound
        }



-- UPDATE


type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | CalendarMsg Calendar.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model.page ) of
        -- GLOBAL COMMUNICATION
        ( UrlChanged url, _ ) ->
            updateUrl url model

        -- LOCAL COMMUNICATION
        ( CalendarMsg subMsg, Calendar subModel ) ->
            Calendar.update subMsg subModel
                |> Tuple.mapBoth
                    (\cmodel -> { model | page = Calendar cmodel })
                    (\cmsg -> Cmd.map CalendarMsg cmsg)

        -- EXTERNAL COMMUNICATION
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


updateUrl : Url.Url -> Model -> ( Model, Cmd Msg )
updateUrl url model =
    oneOf
        [ Parser.map Calendar (s "calendar" </> Calendar.urlParser)
        , Parser.map Blocks (s "blocks" </> Blocks.urlParser)
        ]
        |> (\parser -> Parser.parse parser url)
        |> Maybe.withDefault NotFound
        |> (\page ->
                ( { model | page = page }
                , Cmd.none
                )
           )



-- VIEW


view : Model -> Browser.Document Msg
view model =
    case model.page of
        NotFound ->
            { title = "Not Found"
            , body = [ Html.div [] [ Html.text "Page Not Found" ] ]
            }

        Calendar subModel ->
            Skeleton.view "Calendar" (Calendar.view subModel)

        Blocks subModel ->
            Skeleton.view "Blocks" (Blocks.view subModel)



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none

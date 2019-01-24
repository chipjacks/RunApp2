module Main exposing (main)

import BlockList
import Browser
import Browser.Navigation as Nav
import Calendar
import Html
import Page exposing (Page(..))
import Skeleton
import Url


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



-- INIT


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    loadPage url { key = key, page = NotFound }



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
            loadPage url model

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


loadPage : Url.Url -> Model -> ( Model, Cmd Msg )
loadPage url model =
    let
        page =
            Page.parseUrl url
    in
    ( { model | page = page }, initCmd page )


initCmd : Page -> Cmd Msg
initCmd page =
    case page of
        Calendar model ->
            Calendar.initCmd model |> Cmd.map CalendarMsg

        BlockList _ ->
            Cmd.none

        NotFound ->
            Cmd.none



-- VIEW


view : Model -> Browser.Document Msg
view model =
    case model.page of
        NotFound ->
            { title = Page.title model.page
            , body = [ Html.div [] [ Html.text "Page Not Found" ] ]
            }

        Calendar subModel ->
            Skeleton.view (Page.title model.page) (Calendar.view subModel)

        BlockList subModel ->
            Skeleton.view (Page.title model.page) (BlockList.view subModel)



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none

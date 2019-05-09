module Main exposing (main)

import Browser
import Browser.Events
import Browser.Navigation as Nav
import Date
import Home
import Html
import Route exposing (Route)
import Skeleton
import Url exposing (Url)
import Window exposing (Window)



-- MODEL


type alias Model =
    { key : Nav.Key
    , page : Page
    }


type Page
    = Home Home.Model
    | Welcome
    | NotFound



-- INIT


main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlRequest = LinkClicked
        , onUrlChange = ChangedUrl
        }


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    update
        (ChangedUrl url)
        { key = key, page = Welcome }



-- UPDATE


type Msg
    = LinkClicked Browser.UrlRequest
    | ChangedUrl Url
    | HomeMsg Home.Msg
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model.page ) of
        ( HomeMsg subMsg, Home subModel ) ->
            Home.update subMsg subModel
                |> updateWith Home HomeMsg model

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

        ( ChangedUrl url, _ ) ->
            changeRouteTo model (Route.fromUrl url)

        ( _, _ ) ->
            ( model, Cmd.none )


updateWith : (subModel -> Page) -> (subMsg -> Msg) -> Model -> ( subModel, Cmd subMsg ) -> ( Model, Cmd Msg )
updateWith toPage toMsg model ( subModel, subCmd ) =
    ( { model | page = toPage subModel }
    , Cmd.map toMsg subCmd
    )


changeRouteTo : Model -> Maybe Route -> ( Model, Cmd Msg )
changeRouteTo model routeM =
    case routeM of
        Nothing ->
            ( { model | page = NotFound }, Cmd.none )

        Just (Route.Home homeMsg) ->
            updateHome model homeMsg
                |> updateWith Home HomeMsg model


updateHome : Model -> Home.Msg -> ( Home.Model, Cmd Home.Msg )
updateHome model msg =
    case model.page of
        Home home ->
            Home.update msg home

        _ ->
            Home.init msg



-- VIEW


view : Model -> Browser.Document Msg
view model =
    case model.page of
        Welcome ->
            { title = "RunApp2"
            , body = [ Html.div [] [ Html.text "Welcome to RunApp2" ] ]
            }

        Home subModel ->
            { title = "Home | RunApp2"
            , body = Home.view subModel |> Skeleton.layout |> Html.map HomeMsg |> List.singleton
            }

        NotFound ->
            { title = "Not Found | RunApp2"
            , body = [ Html.div [] [ Html.text "Page Not Found" ] ]
            }



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Browser.Events.onResize (\w h -> HomeMsg (Home.resizeWindow w h))

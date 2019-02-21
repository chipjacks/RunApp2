module Home exposing (Model, Msg, init, openBlockList, openCalendar, resizeWindow, update, view)

import Activities
import Array exposing (Array)
import BlockList
import Calendar
import Config exposing (config)
import Date exposing (Date)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, id)
import Kinto
import Task
import Time exposing (Month(..))
import Window exposing (Window)



-- INITIALIZING MODEL


type alias Model =
    { window : Window
    , focus : Focus
    , activities : Activities.Model
    , col1 : Maybe Calendar.Model
    , col2 : Maybe BlockList.Model
    , col3 : Maybe String
    }


init : Window -> Model
init window =
    Model window First Activities.init Nothing Nothing Nothing



-- UPDATING MODEL


type Msg
    = ChangeFocus Focus (Maybe Column)
    | LoadCalendar Date
    | LoadBlockList Date
    | ResizeWindow Int Int
    | ActivitiesMsg Activities.Msg


openCalendar : Maybe Date -> Msg
openCalendar dateM =
    ChangeFocus First (Maybe.map (\date -> Calendar (Calendar.Model date)) dateM)


openBlockList : Maybe Date -> Msg
openBlockList dateM =
    ChangeFocus Second (Maybe.map (\date -> BlockList (BlockList.Model date)) dateM)


resizeWindow : Int -> Int -> Msg
resizeWindow width height =
    ResizeWindow width height


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangeFocus focus columnM ->
            case columnM of
                Just column ->
                    updateColumn column { model | focus = focus }

                Nothing ->
                    initColumn { model | focus = focus }

        LoadCalendar date ->
            updateColumn (Calendar (Calendar.Model date)) model

        LoadBlockList date ->
            updateColumn (BlockList (BlockList.Model date)) model

        ResizeWindow width height ->
            ( { model | window = Window width height }, Cmd.none )

        ActivitiesMsg subMsg ->
            let
                ( subModel, subCmd ) =
                    Activities.update subMsg model.activities
            in
            ( { model | activities = subModel }, Cmd.map ActivitiesMsg subCmd )



{- VIEWING MODEL
   Uses the off-canvas pattern for responsiveness.
   https://developers.google.com/web/fundamentals/design-and-ux/responsive/patterns#off_canvas
-}


view : Model -> Html Msg
view model =
    let
        columns =
            Array.fromList
                [ viewColM (Calendar.view LoadCalendar) model.col1
                , viewColM
                    (BlockList.view model.activities ActivitiesMsg)
                    model.col2
                , div [ class "column", id "library" ] [ text "Library" ]
                ]
    in
    case visible model.window model.focus of
        AllThree ->
            fullRow (Array.slice 0 3 columns)

        FirstTwo ->
            fullRow (Array.slice 0 2 columns)

        LastTwo ->
            fullRow (Array.slice 1 3 columns)

        FirstOne ->
            fullRow (Array.slice 0 1 columns)

        SecondOne ->
            fullRow (Array.slice 1 2 columns)

        ThirdOne ->
            fullRow (Array.slice 2 3 columns)



-- UPDATING COLUMNS


type Column
    = Calendar Calendar.Model
    | BlockList BlockList.Model


updateColumn : Column -> Model -> ( Model, Cmd Msg )
updateColumn column model =
    case column of
        Calendar calendar ->
            let
                blockListM =
                    Maybe.withDefault (BlockList.Model calendar.date) model.col2
            in
            ( { model | col1 = Just calendar, col2 = Just blockListM }
            , Activities.fetch model.activities calendar.date |> Cmd.map ActivitiesMsg
            )

        BlockList blockList ->
            let
                calendarM =
                    Maybe.withDefault (Calendar.Model blockList.date) model.col1
            in
            ( { model | col2 = Just blockList, col1 = Just calendarM }
            , Activities.fetch model.activities blockList.date |> Cmd.map ActivitiesMsg
            )


initColumn : Model -> ( Model, Cmd Msg )
initColumn model =
    case model.focus of
        First ->
            ( model, Task.perform LoadCalendar Date.today )

        Second ->
            ( model, Task.perform LoadBlockList Date.today )

        _ ->
            ( model, Cmd.none )



-- VIEWING COLUMNS


viewColM : (subModel -> Html msg) -> Maybe subModel -> Html msg
viewColM viewFunc subModelM =
    case subModelM of
        Just subModel ->
            viewFunc subModel

        Nothing ->
            viewEmptyColumn


viewEmptyColumn : Html msg
viewEmptyColumn =
    div [ class "column" ] [ text "Nothing" ]


fullRow : Array (Html msg) -> Html msg
fullRow columns =
    div [ class "ui equal width grid" ] (columns |> Array.toList)



-- FOCUSING AND HIDING COLUMNS


type Visible
    = AllThree
    | FirstTwo
    | LastTwo
    | FirstOne
    | SecondOne
    | ThirdOne


type Focus
    = First
    | Second
    | Third


visible : Window -> Focus -> Visible
visible window focus =
    if window.width < (config.window.minWidth * 2 + 20) then
        zoomOne focus

    else if window.width < (config.window.minWidth * 3 + 40) then
        zoomTwo focus

    else
        AllThree


zoomOne : Focus -> Visible
zoomOne focus =
    case focus of
        First ->
            FirstOne

        Second ->
            SecondOne

        Third ->
            ThirdOne


zoomTwo : Focus -> Visible
zoomTwo focus =
    case focus of
        First ->
            FirstTwo

        Second ->
            FirstTwo

        Third ->
            LastTwo

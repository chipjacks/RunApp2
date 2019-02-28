module Home exposing (Model, Msg, init, openActivityList, openCalendar, resizeWindow, update, view)

import Activities
import ActivityForm
import ActivityList
import Array exposing (Array)
import Browser.Dom as Dom
import Calendar
import Config exposing (config)
import Date exposing (Date, Unit(..))
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, id, style)
import Html.Events exposing (on)
import Json.Decode as Decode
import Task
import Time exposing (Month(..))
import Window exposing (Window)



-- INITIALIZING MODEL


type alias Model =
    { window : Window
    , focus : Focus
    , col1 : Maybe Calendar.Model
    , col2 : Maybe ActivityList.Model
    , col3 : Maybe ActivityForm.Model
    }


init : Window -> Model
init window =
    Model window First Nothing Nothing (Just (ActivityForm.init Nothing))



-- UPDATING MODEL


type Msg
    = ChangeFocus Focus (Maybe Column)
    | LoadCalendar Date
    | LoadActivityList Date
    | ResizeWindow Int Int
    | ScrolledColumn Column Int
    | ActivitiesMsg Activities.Msg
    | ActivityFormMsg ActivityForm.Msg


openCalendar : Maybe Date -> Msg
openCalendar dateM =
    ChangeFocus First (Maybe.map (\date -> Calendar (Calendar.Model date)) dateM)


openActivityList : Maybe Date -> Msg
openActivityList dateM =
    ChangeFocus Second (Maybe.map (\date -> ActivityList (ActivityList.Model date)) dateM)


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

        LoadActivityList date ->
            updateColumn (ActivityList (ActivityList.Model date)) model

        ResizeWindow width height ->
            ( { model | window = Window width height }, Cmd.none )

        ScrolledColumn column scrollTop ->
            ( model, changeDate column scrollTop )

        ActivitiesMsg subMsg ->
            let
                ( subModel, subCmd ) =
                    Activities.update subMsg model.activities
            in
            ( { model | activities = subModel }, Cmd.map ActivitiesMsg subCmd )

        ActivityFormMsg subMsg ->
            case model.col3 of
                Just form ->
                    let
                        ( subModel, subCmd ) =
                            ActivityForm.update subMsg form
                    in
                    ( { model | col3 = Just subModel }, Cmd.map ActivityFormMsg subCmd )

                Nothing ->
                    ( model, Cmd.none )



{- VIEWING MODEL
   Uses the off-canvas pattern for responsiveness.
   https://developers.google.com/web/fundamentals/design-and-ux/responsive/patterns#off_canvas
-}


view : Model -> Html Msg
view model =
    let
        containerDiv children =
            div
                [ class "row grow"
                , id "home"
                , style "overflow" "hidden"
                ]
                (children |> Array.toList)

        columns =
            Array.fromList
                [ viewColM
                    (Calendar.view
                        LoadCalendar
                        (onScroll Calendar)
                    )
                    model.col1
                , viewColM
                    (ActivityList.view model.activities ActivitiesMsg)
                    model.col2
                , viewColM (\m -> ActivityForm.view m |> Html.map ActivityFormMsg) model.col3
                ]
    in
    case visible model.window model.focus of
        AllThree ->
            containerDiv (Array.slice 0 3 columns)

        FirstTwo ->
            containerDiv (Array.slice 0 2 columns)

        LastTwo ->
            containerDiv (Array.slice 1 3 columns)

        FirstOne ->
            containerDiv (Array.slice 0 1 columns)

        SecondOne ->
            containerDiv (Array.slice 1 2 columns)

        ThirdOne ->
            containerDiv (Array.slice 2 3 columns)



-- UPDATING COLUMNS


type Column
    = Calendar Calendar.Model
    | ActivityList ActivityList.Model


updateColumn : Column -> Model -> ( Model, Cmd Msg )
updateColumn column model =
    case column of
        Calendar calendar ->
            let
                activitylistM =
                    Maybe.withDefault (ActivityList.Model calendar.date) model.col2
            in
            ( { model | col1 = Just calendar, col2 = Just activitylistM }
            , Cmd.none
            )

        ActivityList activitylist ->
            let
                calendarM =
                    Maybe.withDefault (Calendar.Model activitylist.date) model.col1
            in
            ( { model | col2 = Just activitylist, col1 = Just calendarM }
            , Task.attempt Activities.fetchedStore Activities.getActivities |> Cmd.map ActivitiesMsg
            )


initColumn : Model -> ( Model, Cmd Msg )
initColumn model =
    case model.focus of
        First ->
            ( model, Task.perform LoadCalendar Date.today )

        Second ->
            ( model, Task.perform LoadActivityList Date.today )

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
    div [ class "column grow" ] [ text "Nothing" ]



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



-- SCROLLING COLUMNS


changeDate : Column -> Int -> Cmd Msg
changeDate column scrollTop =
    let
        scrollTask msg id date =
            if scrollTop < 10 then
                Task.attempt
                    (\_ -> msg (Date.add Months -1 date))
                    (Dom.setViewportOf id 0 250)

            else if scrollTop > 490 then
                Task.attempt
                    (\_ -> msg (Date.add Months 1 date))
                    (Dom.setViewportOf id 0 250)

            else
                Cmd.none
    in
    case column of
        Calendar calendar ->
            scrollTask LoadCalendar "calendar" calendar.date

        ActivityList activitylist ->
            scrollTask LoadActivityList "activities" activitylist.date


onScroll : (a -> Column) -> (a -> Html.Attribute Msg)
onScroll toColumn =
    \subModel ->
        on "scroll"
            (Decode.at [ "target", "scrollTop" ] Decode.int
                |> Decode.map (ScrolledColumn (toColumn subModel))
            )

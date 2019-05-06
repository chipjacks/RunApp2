module Home exposing (Model, Msg, init, openActivity, openActivityList, openCalendar, resizeWindow, update, view)

import Activity exposing (Activity)
import ActivityForm
import ActivityList
import Api
import Array
import Browser.Dom as Dom
import Calendar
import Config exposing (config)
import Date exposing (Date, Unit(..))
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, id, style)
import Http
import Scroll
import Skeleton exposing (column, expandingRow, row)
import Task
import Time exposing (Month(..))
import Window exposing (Window)



-- INITIALIZING MODEL


type Model
    = Loading (Maybe Window) (Maybe Date) (Maybe (List Activity))
    | Loaded State


type alias State =
    { window : Window
    , focus : Focus
    , calendar : Bool
    , date : Date
    , activities : List Activity
    , activityForm : ActivityForm.Model
    }


init : ( Model, Cmd Msg )
init =
    ( Loading Nothing Nothing Nothing
    , Cmd.batch
        [ Task.perform (\v -> ResizeWindow (round v.scene.width) (round v.scene.height)) Dom.getViewport
        , Task.perform (\date -> LoadActivities <| Just date) Date.today
        , Task.attempt GotActivities Api.getActivities
        ]
    )



-- UPDATING MODEL


type Msg
    = LoadCalendar (Maybe Date)
    | LoadActivities (Maybe Date)
    | LoadActivity (Maybe Activity.Id)
    | GotActivities (Result Http.Error (List Activity))
    | ResizeWindow Int Int
    | ScrolledCalendar Int
    | ScrolledActivities Int
    | EditActivity Activity
    | ActivityFormMsg ActivityForm.Msg


openCalendar : Maybe Date -> Msg
openCalendar dateM =
    LoadCalendar dateM


openActivityList : Maybe Date -> Msg
openActivityList dateM =
    LoadActivities dateM


openActivity : Maybe Activity.Id -> Msg
openActivity idM =
    LoadActivity idM


resizeWindow : Int -> Int -> Msg
resizeWindow width height =
    ResizeWindow width height


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case model of
        Loading windowM dateM activitiesM ->
            case msg of
                ResizeWindow width height ->
                    Loading (Just <| Window width height) dateM activitiesM
                        |> updateLoading

                LoadCalendar (Just date) ->
                    Loading windowM (Just date) activitiesM
                        |> updateLoading

                LoadActivities (Just date) ->
                    Loading windowM (Just date) activitiesM
                        |> updateLoading

                GotActivities activitiesR ->
                    case activitiesR of
                        Ok activities ->
                            Loading windowM dateM (Just activities)
                                |> updateLoading

                        _ ->
                            ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        Loaded state ->
            case msg of
                LoadCalendar dateM ->
                    case dateM of
                        Just date ->
                            ( Loaded { state | focus = DateSelect, date = date, calendar = True }
                            , Scroll.reset ScrolledCalendar "calendar"
                            )

                        Nothing ->
                            ( Loaded { state | focus = DateSelect, calendar = True }
                            , Scroll.reset ScrolledCalendar "calendar"
                            )

                LoadActivities dateM ->
                    case dateM of
                        Just date ->
                            ( Loaded { state | focus = ActivityView, date = date, calendar = False }
                            , Scroll.reset ScrolledActivities "activities"
                            )

                        Nothing ->
                            ( Loaded { state | focus = DateSelect, calendar = False }
                            , Scroll.reset ScrolledActivities "activities"
                            )

                LoadActivity idM ->
                    case idM of
                        Just id ->
                            let
                                activityM =
                                    state.activities |> List.filter (\a -> a.id == id) |> List.head
                            in
                            case activityM of
                                Just activity ->
                                    ( Loaded { state | focus = ActivityView, activityForm = ActivityForm.initEdit activity }
                                    , Cmd.none
                                    )

                                Nothing ->
                                    -- TODO: error handling
                                    ( model, Cmd.none )

                        Nothing ->
                            ( Loaded { state | focus = ActivityView, activityForm = ActivityForm.initNew }, Cmd.none )

                GotActivities result ->
                    case result of
                        Ok activities ->
                            ( Loaded { state | activities = activities }, Cmd.none )

                        _ ->
                            ( model, Cmd.none )

                ResizeWindow width height ->
                    ( Loaded { state | window = Window width height }, resetScrolls )

                ScrolledCalendar scrollTop ->
                    let
                        ( dateF, cmd ) =
                            Calendar.handleScroll scrollTop ScrolledCalendar
                    in
                    ( Loaded { state | date = dateF state.date }, cmd )

                ScrolledActivities scrollTop ->
                    let
                        ( dateF, cmd ) =
                            ActivityList.handleScroll scrollTop ScrolledActivities
                    in
                    ( Loaded { state | date = dateF state.date }, cmd )

                EditActivity activity ->
                    ( Loaded { state | activityForm = ActivityForm.initEdit activity }, Cmd.none )

                ActivityFormMsg subMsg ->
                    let
                        newState =
                            case subMsg of
                                ActivityForm.GotSubmitResult (Ok activities) ->
                                    { state | activities = activities }

                                ActivityForm.GotDeleteResult (Ok activities) ->
                                    { state | activities = activities }

                                _ ->
                                    state

                        ( subModel, subCmd ) =
                            ActivityForm.update subMsg state.activityForm
                    in
                    ( Loaded { state | activityForm = subModel }, Cmd.map ActivityFormMsg subCmd )


updateLoading : Model -> ( Model, Cmd Msg )
updateLoading model =
    case model of
        Loading (Just window) (Just date) (Just activities) ->
            ( Loaded <| State window ActivityView False date activities ActivityForm.initNew
            , Scroll.reset ScrolledActivities "activities"
            )

        _ ->
            ( model, Cmd.none )



{- VIEWING MODEL
   Uses the off-canvas pattern for responsiveness.
   https://developers.google.com/web/fundamentals/design-and-ux/responsive/patterns#off_canvas
-}


view : Model -> Html Msg
view model =
    case model of
        Loading _ _ _ ->
            Html.div [] [ Html.text "Loading" ]

        Loaded state ->
            let
                containerDiv =
                    expandingRow
                        [ id "home"
                        , style "overflow" "hidden"
                        ]

                dateSelect =
                    case state.calendar of
                        True ->
                            Calendar.view (\d -> LoadCalendar (Just d)) ScrolledCalendar state.date

                        False ->
                            ActivityList.view state.activities EditActivity ScrolledActivities state.date

                activityView =
                    ActivityForm.view
                        state.activityForm
                        |> Html.map ActivityFormMsg
            in
            case visible state.window state.focus of
                One DateSelect ->
                    containerDiv [ dateSelect ]

                One ActivityView ->
                    containerDiv [ activityView ]

                Both ->
                    containerDiv [ dateSelect, activityView ]



-- FOCUSING AND HIDING COLUMNS


type Visible
    = One Focus
    | Both


type Focus
    = DateSelect
    | ActivityView


visible : Window -> Focus -> Visible
visible window focus =
    if window.width < (config.window.minWidth * 2 + 20) then
        One focus

    else
        Both


resetScrolls : Cmd Msg
resetScrolls =
    Cmd.batch
        [ Scroll.reset ScrolledCalendar "calendar"
        , Scroll.reset ScrolledActivities "activities"
        ]

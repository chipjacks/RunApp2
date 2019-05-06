module Home exposing (Model, Msg, init, openActivity, openCalendar, resizeWindow, update, view)

import Activity exposing (Activity)
import ActivityForm
import Api
import Array
import Browser.Dom as Dom
import Calendar
import Config exposing (config)
import Date exposing (Date, Interval(..), Unit(..))
import Html exposing (Html, a, button, div, text)
import Html.Attributes exposing (class, href, id, style)
import Html.Events exposing (on, onClick)
import Http
import Link
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
        , Task.perform LoadDate Date.today
        , Task.attempt GotActivities Api.getActivities
        ]
    )



-- UPDATING MODEL


type Msg
    = LoadDate Date
    | ToggleCalendar
    | FocusDateSelect
    | LoadActivity (Maybe Activity.Id)
    | GotActivities (Result Http.Error (List Activity))
    | ResizeWindow Int Int
    | ScrolledCalendar Int
    | ScrolledActivities Int
    | EditActivity Activity
    | ActivityFormMsg ActivityForm.Msg


openCalendar : Maybe Date -> Msg
openCalendar dateM =
    case dateM of
        Just date ->
            LoadDate date

        Nothing ->
            FocusDateSelect


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

                LoadDate date ->
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
                LoadDate date ->
                    ( Loaded { state | focus = DateSelect, date = date }
                    , Scroll.reset ScrolledCalendar "calendar"
                    )

                ToggleCalendar ->
                    ( Loaded { state | focus = DateSelect, calendar = not state.calendar }
                    , Scroll.reset ScrolledCalendar "calendar"
                    )

                FocusDateSelect ->
                    ( Loaded { state | focus = DateSelect }
                    , Scroll.reset ScrolledCalendar "calendar"
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
                            Calendar.handleWeekScroll scrollTop ScrolledCalendar
                    in
                    ( Loaded { state | date = dateF state.date }, cmd )

                ScrolledActivities scrollTop ->
                    let
                        ( dateF, cmd ) =
                            Calendar.handleDayScroll scrollTop ScrolledActivities
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
            , Scroll.reset ScrolledCalendar "calendar"
            )

        _ ->
            ( model, Cmd.none )



-- VIEW


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

                activityView =
                    ActivityForm.view
                        state.activityForm
                        |> Html.map ActivityFormMsg
            in
            case visible state.window state.focus of
                One DateSelect ->
                    containerDiv [ viewDateSelect state ]

                One ActivityView ->
                    containerDiv [ activityView ]

                Both ->
                    containerDiv [ viewDateSelect state, activityView ]


viewDateSelect : State -> Html Msg
viewDateSelect state =
    let
        calendarView =
            case state.calendar of
                True ->
                    Calendar.Weekly

                False ->
                    Calendar.Daily state.activities EditActivity
    in
    column []
        [ row []
            [ div [ class "dropdown" ]
                [ button [ style "width" "6rem" ]
                    [ text (Date.format "MMMM" state.date)
                    ]
                , div [ class "dropdown-content", style "width" "6rem" ]
                    (listMonths state.date LoadDate)
                ]
            , div [ class "dropdown", style "margin-left" "0.5rem" ]
                [ button [ style "width" "4rem" ]
                    [ text (Date.format "yyyy" state.date)
                    ]
                , div [ class "dropdown-content", style "width" "4rem" ]
                    (listYears state.date LoadDate)
                ]
            , a
                [ class "button"
                , style "margin-left" "0.5rem"
                , href (Link.toCalendar Nothing)
                ]
                [ text "Today" ]
            , button
                [ onClick ToggleCalendar
                , style "margin-left" "0.5em"
                ]
                [ text "=" ]
            ]
        , Calendar.view ScrolledCalendar state.date calendarView
        ]


listMonths : Date -> (Date -> msg) -> List (Html msg)
listMonths date changeDate =
    let
        start =
            Date.fromCalendarDate (Date.year date) Jan 1

        end =
            Date.fromCalendarDate (Date.add Years 1 date |> Date.year) Jan 1
    in
    Date.range Month 1 start end
        |> List.map (viewDropdownItem changeDate "MMMM")


listYears : Date -> (Date -> msg) -> List (Html msg)
listYears date changeDate =
    let
        middle =
            Date.fromCalendarDate 2019 Jan 1

        start =
            Date.add Years -3 middle

        end =
            Date.add Years 3 middle
    in
    Date.range Month 12 start end
        |> List.map (viewDropdownItem changeDate "yyyy")


viewDropdownItem : (Date -> msg) -> String -> Date -> Html msg
viewDropdownItem changeDate formatDate date =
    div [ onClick (changeDate date) ] [ text <| Date.format formatDate date ]



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

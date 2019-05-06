module Home exposing (Model, Msg, init, openActivity, openCalendar, resizeWindow, update, view)

import Activity exposing (Activity)
import ActivityForm
import Api
import Array
import Browser.Dom as Dom
import Calendar
import Config exposing (config)
import Date exposing (Date, Interval(..), Unit(..))
import Html exposing (Html, a, button, div, i, text)
import Html.Attributes exposing (class, href, id, style)
import Html.Events exposing (on, onClick)
import Http
import Link
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
    , calendar : Calendar.Model Msg
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
    | LoadToday
    | ToggleCalendar
    | FocusCalendar
    | LoadActivity Activity.Id
    | GotActivities (Result Http.Error (List Activity))
    | ResizeWindow Int Int
    | EditActivity Activity
    | ActivityFormMsg ActivityForm.Msg
    | NoOp


openCalendar : Msg
openCalendar =
    FocusCalendar


openActivity : Activity.Id -> Msg
openActivity id =
    LoadActivity id


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
                    if date == state.date then
                        ( model, Cmd.none )

                    else
                        ( Loaded { state | focus = DateSelect, date = date }
                        , Calendar.resetScroll NoOp
                        )

                LoadToday ->
                    ( model
                    , Task.perform LoadDate Date.today
                    )

                ToggleCalendar ->
                    let
                        toggledCalendar =
                            case state.calendar of
                                Calendar.Weekly ->
                                    Calendar.Daily state.activities EditActivity

                                Calendar.Daily _ _ ->
                                    Calendar.Weekly
                    in
                    ( Loaded { state | focus = DateSelect, calendar = toggledCalendar }
                    , Calendar.resetScroll NoOp
                    )

                FocusCalendar ->
                    ( Loaded { state | focus = DateSelect }
                    , Calendar.resetScroll NoOp
                    )

                LoadActivity id ->
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

                GotActivities result ->
                    case result of
                        Ok activities ->
                            ( Loaded { state | activities = activities }, Cmd.none )

                        _ ->
                            ( model, Cmd.none )

                ResizeWindow width height ->
                    ( Loaded { state | window = Window width height }, Calendar.resetScroll NoOp )

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

                NoOp ->
                    ( model, Cmd.none )


updateLoading : Model -> ( Model, Cmd Msg )
updateLoading model =
    case model of
        Loading (Just window) (Just date) (Just activities) ->
            ( Loaded <| State window ActivityView Calendar.Weekly date activities ActivityForm.initNew
            , Calendar.resetScroll NoOp
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
        calendarIcon =
            case state.calendar of
                Calendar.Weekly ->
                    [ i [ class "far fa-calendar-minus" ] [] ]

                _ ->
                    [ i [ class "far fa-calendar-alt" ] [] ]
    in
    column []
        [ row []
            [ button [ onClick ToggleCalendar ] calendarIcon
            , div [ class "dropdown", style "margin-left" "0.5rem" ]
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
            , button
                [ style "margin-left" "0.5rem"
                , onClick LoadToday
                ]
                [ text "Today" ]
            ]
        , Calendar.view LoadDate state.date state.calendar
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
            Date.fromCalendarDate 2019 (Date.month date) 1

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

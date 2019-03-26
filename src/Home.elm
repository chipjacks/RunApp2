module Home exposing (Model, Msg, init, openActivityList, openCalendar, resizeWindow, update, view)

import Activity exposing (Activity)
import ActivityForm exposing (ActivityForm)
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
import Task
import Time exposing (Month(..))
import Window exposing (Window)



-- INITIALIZING MODEL


type alias Model =
    { window : Window
    , focus : Focus
    , calendarDate : Maybe Date
    , activitiesDate : Maybe Date
    , activityDate : Maybe Date
    , activities : Maybe (List Activity)
    , editedActivity : ActivityForm
    }


init : ( Model, Cmd Msg )
init =
    ( Model (Window 0 0) First Nothing Nothing Nothing Nothing (ActivityForm Nothing "")
    , Task.perform (\v -> ResizeWindow (round v.scene.width) (round v.scene.height)) Dom.getViewport
    )



-- UPDATING MODEL


type Msg
    = LoadCalendar (Maybe Date)
    | LoadActivities (Maybe Date)
    | GotActivities (Result Http.Error (List Activity))
    | ResizeWindow Int Int
    | ScrolledCalendar Int
    | EditActivity Activity
    | EditDescription String
    | SubmitActivity
    | SubmitResult (Result ActivityForm.SubmitError (List Activity))


openCalendar : Maybe Date -> Msg
openCalendar dateM =
    LoadCalendar dateM


openActivityList : Maybe Date -> Msg
openActivityList dateM =
    LoadActivities dateM


resizeWindow : Int -> Int -> Msg
resizeWindow width height =
    ResizeWindow width height


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoadCalendar dateM ->
            case dateM of
                Just date ->
                    ( { model | focus = First, calendarDate = Just date }, resetCalendarScroll )
                        |> updateDate date

                Nothing ->
                    ( model, Task.perform (\d -> LoadCalendar (Just d)) Date.today )

        LoadActivities dateM ->
            case dateM of
                Just date ->
                    ( { model | focus = Second, activitiesDate = Just date }
                    , Task.attempt GotActivities Api.getActivities
                    )
                        |> updateDate date

                Nothing ->
                    ( model, Task.perform (\d -> LoadActivities (Just d)) Date.today )

        GotActivities result ->
            case result of
                Ok activities ->
                    ( { model | activities = Just activities }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        ResizeWindow width height ->
            ( { model | window = Window width height }, resetCalendarScroll )

        ScrolledCalendar scrollTop ->
            let
                ( dateF, cmd ) =
                    if scrollTop < Calendar.scrollConfig.loadPrevious then
                        ( Date.add Weeks -4, resetCalendarScroll )

                    else if scrollTop > Calendar.scrollConfig.loadNext then
                        ( Date.add Weeks 4, resetCalendarScroll )

                    else
                        ( identity, Cmd.none )
            in
            ( { model | calendarDate = model.calendarDate |> Maybe.map dateF }, cmd )

        EditActivity activity ->
            let
                editActivity =
                    ActivityForm (Just activity.id) activity.description
            in
            ( { model | editedActivity = editActivity }, Cmd.none )

        EditDescription desc ->
            let
                updatedActivity =
                    ActivityForm model.editedActivity.id desc
            in
            ( { model | editedActivity = updatedActivity }, Cmd.none )

        SubmitActivity ->
            let
                saveActivityT =
                    ActivityForm.toActivity model.editedActivity model.activityDate
                        |> Task.andThen (\a -> Api.saveActivity a |> Task.mapError (\_ -> ActivityForm.ApiError))

                newActivity =
                    ActivityForm Nothing ""
            in
            ( { model | editedActivity = newActivity }, Task.attempt SubmitResult saveActivityT )

        SubmitResult result ->
            case result of
                Ok activities ->
                    ( { model | activities = Just activities }, Cmd.none )

                _ ->
                    -- TODO: handle errors on activity submit
                    ( model, Cmd.none )


updateDate : Date -> ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
updateDate date ( model, cmd ) =
    let
        ( calendarDate, calendarCmd ) =
            if model.calendarDate == Nothing then
                ( Just date, resetCalendarScroll )

            else
                ( model.calendarDate, Cmd.none )

        ( activitiesDate, activitiesCmd ) =
            if model.activitiesDate == Nothing then
                ( Just date, Task.attempt GotActivities Api.getActivities )

            else
                ( model.activitiesDate, Cmd.none )

        ( activityDate, activityCmd ) =
            if model.activityDate == Nothing then
                ( Just date, Cmd.none )

            else
                ( model.activityDate, Cmd.none )
    in
    ( { model | calendarDate = calendarDate, activitiesDate = activitiesDate, activityDate = activityDate }
    , Cmd.batch [ cmd, calendarCmd, activitiesCmd, activityCmd ]
    )



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
                    (Calendar.view (\d -> LoadCalendar (Just d)) ScrolledCalendar)
                    model.calendarDate
                , viewColM
                    (ActivityList.view model.activities EditActivity)
                    model.activitiesDate
                , ActivityForm.view
                    model.editedActivity
                    model.activityDate
                    EditDescription
                    SubmitActivity
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



-- SCROLLING CALENDAR


resetCalendarScroll : Cmd Msg
resetCalendarScroll =
    Task.attempt
        (\_ -> ScrolledCalendar Calendar.scrollConfig.center)
        (Dom.setViewportOf "calendar" 0 Calendar.scrollConfig.center)

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


type alias Model =
    { window : Window
    , focus : Focus
    , calendar : Bool
    , date : Maybe Date
    , activities : Maybe (List Activity)
    , activityForm : ActivityForm.Model
    }


init : ( Model, Cmd Msg )
init =
    ( Model (Window 0 0) DateSelect False Nothing Nothing ActivityForm.initNew
    , Task.perform (\v -> ResizeWindow (round v.scene.width) (round v.scene.height)) Dom.getViewport
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
    case msg of
        LoadCalendar dateM ->
            case dateM of
                Just date ->
                    ( { model | focus = DateSelect, date = Just date, calendar = True }, Scroll.reset ScrolledCalendar "calendar" )
                        |> updateDate date

                Nothing ->
                    ( model, Task.perform (\d -> LoadCalendar (Just d)) Date.today )

        LoadActivities dateM ->
            case dateM of
                Just date ->
                    ( { model | focus = DateSelect, date = Just date, calendar = False }
                    , Task.attempt GotActivities Api.getActivities
                    )
                        |> updateDate date

                Nothing ->
                    ( model, Task.perform (\d -> LoadActivities (Just d)) Date.today )

        LoadActivity idM ->
            case ( idM, model.activities ) of
                ( Just id, Just activities ) ->
                    let
                        activityM =
                            activities |> List.filter (\a -> a.id == id) |> List.head
                    in
                    case activityM of
                        Just activity ->
                            ( { model | focus = ActivityView, activityForm = ActivityForm.initEdit activity }, Cmd.none )

                        Nothing ->
                            -- TODO: error handling
                            ( model, Cmd.none )

                ( Just id, Nothing ) ->
                    -- TODO: Load activities
                    ( model, Cmd.none )

                ( Nothing, _ ) ->
                    ( { model | focus = ActivityView, activityForm = ActivityForm.initNew }, Cmd.none )

        GotActivities result ->
            case result of
                Ok activities ->
                    ( { model | activities = Just activities }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        ResizeWindow width height ->
            ( { model | window = Window width height }, resetScrolls )

        ScrolledCalendar scrollTop ->
            let
                ( dateF, cmd ) =
                    Calendar.handleScroll scrollTop ScrolledCalendar
            in
            ( { model | date = model.date |> Maybe.map dateF }, cmd )

        ScrolledActivities scrollTop ->
            let
                ( dateF, cmd ) =
                    ActivityList.handleScroll scrollTop ScrolledActivities
            in
            ( { model | date = model.date |> Maybe.map dateF }, cmd )

        EditActivity activity ->
            ( { model | activityForm = ActivityForm.initEdit activity }, Cmd.none )

        ActivityFormMsg subMsg ->
            let
                newModel =
                    case subMsg of
                        ActivityForm.GotSubmitResult (Ok activities) ->
                            { model | activities = Just activities }

                        ActivityForm.GotDeleteResult (Ok activities) ->
                            { model | activities = Just activities }

                        _ ->
                            model

                ( subModel, subCmd ) =
                    ActivityForm.update subMsg newModel.activityForm
            in
            ( { newModel | activityForm = subModel }, Cmd.map ActivityFormMsg subCmd )


updateDate : Date -> ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
updateDate date ( model, cmd ) =
    let
        activityForm =
            if ActivityForm.dateRequested model.activityForm then
                ActivityForm.selectDate model.activityForm date

            else
                model.activityForm
    in
    ( { model | activityForm = activityForm }
    , Cmd.none
    )



{- VIEWING MODEL
   Uses the off-canvas pattern for responsiveness.
   https://developers.google.com/web/fundamentals/design-and-ux/responsive/patterns#off_canvas
-}


view : Model -> Html Msg
view model =
    let
        containerDiv =
            expandingRow
                [ id "home"
                , style "overflow" "hidden"
                ]

        dateSelect =
            case model.calendar of
                True ->
                    viewColM
                        (Calendar.view (\d -> LoadCalendar (Just d)) ScrolledCalendar)
                        model.date

                False ->
                    viewColM
                        (ActivityList.view model.activities EditActivity ScrolledActivities)
                        model.date

        activityView =
            ActivityForm.view
                model.activityForm
                |> Html.map ActivityFormMsg
    in
    case visible model.window model.focus of
        One DateSelect ->
            containerDiv [ dateSelect ]

        One ActivityView ->
            containerDiv [ activityView ]

        Both ->
            containerDiv [ dateSelect, activityView ]



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
    column [] [ text "Nothing" ]



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

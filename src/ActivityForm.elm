module ActivityForm exposing (Model, Msg(..), generateNewId, initEdit, initNew, isCreating, isEditing, save, selectDate, update, view)

import Activity exposing (Activity, Minutes)
import ActivityShape
import Api
import Array exposing (Array)
import Date exposing (Date)
import Html exposing (Html, a, button, div, i, input, text)
import Html.Attributes exposing (class, href, id, name, placeholder, style, type_, value)
import Html.Events exposing (on, onClick, onInput)
import Http
import Json.Decode as Decode
import Random
import Skeleton exposing (column, compactColumn, expandingRow, row, viewIf)
import Task exposing (Task)



{- GOOD EXAMPLE:
   https://github.com/rtfeldman/elm-spa-example/blob/master/src/Page/Settings.elm
-}


type alias Model =
    { status : Status
    , date : Maybe Date
    , description : String
    , completed : Bool
    , duration : Maybe Minutes
    , pace : Maybe Activity.Pace
    , distance : Maybe Activity.Distance
    , result : Result Error Activity
    }


type Status
    = Creating Activity.Id
    | Editing Activity.Id
    | Saving


type Msg
    = SelectedShape Activity.ActivityType
    | EditedDescription String
    | CheckedCompleted Bool
    | EditedDuration String
    | SelectedPace String
    | SelectedDistance String
    | ClickedSubmit
    | ClickedDelete
    | ClickedMove
    | NewId String
    | GotSubmitResult (Result Error (List Activity))
    | GotDeleteResult (Result Error (List Activity))
    | Close


type Error
    = ApiError
    | EmptyFieldError String


initNew : Activity.Id -> Maybe Date -> Bool -> Model
initNew id dateM completed =
    Model (Creating id) dateM "" completed (Just 30) (Just Activity.Easy) Nothing (Err (EmptyFieldError ""))


initEdit : Activity -> Model
initEdit activity =
    Model (Editing activity.id) (Just activity.date) activity.description activity.completed (Just activity.duration) activity.pace activity.distance (Ok activity)


save : Model -> List Activity -> List Activity
save { result, status } activities =
    case ( result, status ) of
        ( Ok activity, Editing id ) ->
            Api.updateActivity { activity | id = id } False activities

        ( Ok activity, Creating id ) ->
            Api.updateActivity { activity | id = id } True activities

        _ ->
            activities


selectDate : Date -> Model -> Model
selectDate date model =
    if model.date == Nothing then
        updateResult { model | date = Just date }

    else
        model


isEditing : Activity -> Model -> Bool
isEditing activity model =
    case model.status of
        Editing id ->
            activity.id == id

        _ ->
            False


isCreating : Date -> Model -> Bool
isCreating date model =
    case model.status of
        Creating _ ->
            model.date == Just date

        _ ->
            False


validateFieldExists : Maybe a -> String -> Result Error a
validateFieldExists fieldM fieldName =
    case fieldM of
        Just field ->
            Ok field

        Nothing ->
            Err <| EmptyFieldError fieldName


validate : Model -> Result Error Activity
validate model =
    Result.map3
        (\date description duration ->
            Activity "" date description model.completed duration model.pace model.distance
        )
        (validateFieldExists model.date "date")
        (validateFieldExists (Just model.description) "description")
        (validateFieldExists model.duration "duration")


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SelectedShape activityType ->
            case activityType of
                Activity.Run ->
                    ( updateResult
                        { model
                            | pace = model.pace |> Maybe.withDefault Activity.Easy |> Just
                            , distance = Nothing
                            , duration = model.duration |> Maybe.withDefault 30 |> Just
                        }
                    , Cmd.none
                    )

                Activity.Race ->
                    ( updateResult
                        { model
                            | pace = Nothing
                            , distance = model.distance |> Maybe.withDefault Activity.FiveK |> Just
                            , duration = model.duration |> Maybe.withDefault 20 |> Just
                        }
                    , Cmd.none
                    )

                Activity.Other ->
                    ( updateResult { model | pace = Nothing, distance = Nothing }
                    , Cmd.none
                    )

        EditedDescription desc ->
            ( updateResult { model | description = desc }
            , Cmd.none
            )

        CheckedCompleted bool ->
            ( updateResult { model | completed = bool }
            , Cmd.none
            )

        EditedDuration str ->
            ( updateResult { model | duration = String.toInt str }
            , Cmd.none
            )

        SelectedPace str ->
            ( updateResult { model | pace = Activity.pace.fromString str }
            , Cmd.none
            )

        SelectedDistance str ->
            ( updateResult { model | distance = Activity.distance.fromString str }
            , Cmd.none
            )

        ClickedSubmit ->
            case model.result of
                Ok activity ->
                    let
                        apiTask =
                            case model.status of
                                Editing id ->
                                    Api.saveActivity { activity | id = id }

                                Creating id ->
                                    Api.createActivity { activity | id = id }

                                Saving ->
                                    Task.fail (Http.BadUrl "Invalid submit")
                    in
                    ( { model | status = Saving }, Task.attempt GotSubmitResult (apiTask |> Task.mapError (\_ -> ApiError)) )

                Err error ->
                    ( model, Cmd.none )

        ClickedDelete ->
            case model.status of
                Editing id ->
                    ( model
                    , Cmd.batch
                        [ Task.perform (\_ -> Close) (Task.succeed ())
                        , Task.attempt GotDeleteResult (Api.deleteActivity id |> Task.mapError (\_ -> ApiError))
                        , generateNewId
                        ]
                    )

                _ ->
                    ( model, Task.perform (\_ -> Close) (Task.succeed ()) )

        ClickedMove ->
            let
                newModel =
                    { model | date = Nothing }
            in
            ( { newModel | result = validate newModel }, Cmd.none )

        NewId id ->
            ( initNew id model.date model.completed, Cmd.none )

        GotSubmitResult result ->
            case result of
                Ok activities ->
                    ( model, Cmd.none )

                Err error ->
                    ( { model | result = Err error }, Cmd.none )

        GotDeleteResult result ->
            case result of
                Ok activities ->
                    ( model, Cmd.none )

                Err error ->
                    ( { model | result = Err error }, Cmd.none )

        Close ->
            ( model, Cmd.none )


updateResult : Model -> Model
updateResult model =
    { model | result = validate model }


generateNewId : Cmd Msg
generateNewId =
    let
        digitsToString digits =
            List.map String.fromInt digits
                |> String.join ""
    in
    Random.list 10 (Random.int 0 9)
        |> Random.map digitsToString
        |> Random.generate NewId


view : Model -> Html Msg
view model =
    let
        activityShape =
            validate model
                |> Result.toMaybe
                |> Maybe.map ActivityShape.view
                |> Maybe.withDefault (ActivityShape.viewDefault True Activity.Other)
    in
    row [ id "activity", style "margin-bottom" "1rem" ]
        [ compactColumn [ style "flex-basis" "5rem", style "justify-content" "center" ] [ activityShape ]
        , column []
            [ row []
                [ compactColumn [] [ shapeSelect model.completed ]
                , column [ style "align-items" "flex-end" ]
                    [ row [ style "align-items" "flex-start" ]
                        [ a [ class "button small", style "margin-right" "0.2rem", onClick ClickedMove ] [ i [ class "fas fa-arrow-right" ] [] ]
                        , deleteButton
                        ]
                    ]
                ]
            , row []
                [ input
                    [ type_ "text"
                    , placeholder "Description"
                    , onInput EditedDescription
                    , name "description"
                    , value model.description
                    , style "width" "100%"
                    ]
                    []
                ]
            , row [ style "flex-wrap" "wrap", style "align-items" "center" ]
                [ compactColumn [] [ durationInput EditedDuration model.duration ]
                , compactColumn [] [ maybeView model.pace (paceSelect SelectedPace) ]
                , compactColumn [] [ maybeView model.distance (distanceSelect SelectedDistance) ]
                , compactColumn []
                    [ maybeView (Result.toMaybe model.result |> Maybe.andThen Activity.mprLevel)
                        (\level -> text <| "Level " ++ String.fromInt level)
                    ]
                , column [ style "align-items" "flex-end" ] [ submitButton model.status ]
                ]
            , row []
                [ viewError model.result ]
            ]
        ]


shapeSelect : Bool -> Html Msg
shapeSelect completed =
    row []
        [ compactColumn [ onClick (SelectedShape Activity.Run) ] [ ActivityShape.viewDefault completed Activity.Run ]
        , compactColumn [ style "margin-left" "0.5rem", onClick (SelectedShape Activity.Race) ] [ ActivityShape.viewDefault completed Activity.Race ]
        , compactColumn [ style "margin-left" "0.5rem", onClick (SelectedShape Activity.Other) ] [ ActivityShape.viewDefault completed Activity.Other ]
        , compactColumn [ style "margin-left" "0.5rem" ] [ completedCheckbox completed ]
        ]


completedCheckbox : Bool -> Html Msg
completedCheckbox completed =
    div []
        [ input
            [ type_ "checkbox"
            , Html.Attributes.checked completed
            , Html.Events.onCheck CheckedCompleted
            ]
            []
        ]


submitButton : Status -> Html Msg
submitButton status =
    a
        [ class "button medium"
        , class "primary"
        , type_ "submit"
        , onClick ClickedSubmit
        ]
        [ i [ class "fas fa-check" ] [] ]


deleteButton : Html Msg
deleteButton =
    a
        [ class "button small"
        , onClick ClickedDelete
        ]
        [ i [ class "fas fa-times" ] [] ]


durationInput : (String -> Msg) -> Maybe Activity.Minutes -> Html Msg
durationInput msg duration =
    input
        [ type_ "number"
        , placeholder "Mins"
        , onInput msg
        , name "duration"
        , style "width" "3rem"
        , class "input-small"
        , value (duration |> Maybe.map String.fromInt |> Maybe.withDefault "")
        ]
        []


maybeView : Maybe a -> (a -> Html Msg) -> Html Msg
maybeView attrM viewF =
    case attrM of
        Just attr ->
            viewF attr

        Nothing ->
            Html.text ""


paceSelect : (String -> Msg) -> Activity.Pace -> Html Msg
paceSelect msg pace =
    let
        selectedAttr paceStr =
            if Activity.pace.toString pace == paceStr then
                [ Html.Attributes.attribute "selected" "" ]

            else
                []
    in
    Html.select
        [ onInput msg
        , name "pace"
        , class "input-small"
        ]
        (List.map
            (\( paceStr, _ ) ->
                Html.option (selectedAttr paceStr) [ Html.text (String.split " " paceStr |> List.head |> Maybe.withDefault "") ]
            )
            Activity.pace.list
        )


distanceSelect : (String -> Msg) -> Activity.Distance -> Html Msg
distanceSelect msg distance =
    let
        selectedAttr distanceStr =
            if Activity.distance.toString distance == distanceStr then
                [ Html.Attributes.attribute "selected" "" ]

            else
                []
    in
    Html.select
        [ onInput msg
        , name "distance"
        , class "input-small"
        ]
        (List.map
            (\( distanceStr, _ ) ->
                Html.option (selectedAttr distanceStr) [ Html.text distanceStr ]
            )
            Activity.distance.list
        )


viewError : Result Error Activity -> Html Msg
viewError errorR =
    case errorR of
        Err error ->
            div [ class "error" ] [ text <| errorMessage error ]

        _ ->
            div [ class "error" ] []


errorMessage : Error -> String
errorMessage error =
    case error of
        EmptyFieldError field ->
            "Please fill in " ++ field ++ " field"

        _ ->
            "There has been an error"

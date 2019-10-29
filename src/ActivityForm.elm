module ActivityForm exposing (Model, Msg(..), initEdit, initNew, isCreating, isEditing, selectDate, update, view)

import Activity exposing (Activity, Minutes)
import ActivityShape
import Api
import Array exposing (Array)
import Date exposing (Date)
import Html exposing (Html, a, button, div, i, input, text)
import Html.Attributes exposing (class, href, id, name, placeholder, style, type_, value)
import Html.Events exposing (on, onClick, onInput)
import Json.Decode as Decode
import Skeleton exposing (column, compactColumn, expandingRow, row)
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
    , result : Result Error Activity
    }


type Status
    = Creating
    | Editing Activity.Id


type Msg
    = EditedDescription String
    | CheckedCompleted Bool
    | EditedDuration String
    | SelectedPace String
    | ClickedSubmit
    | ClickedReset
    | ClickedDelete
    | ClickedMove
    | GotSubmitResult (Result Error (List Activity))
    | GotDeleteResult (Result Error (List Activity))


type Error
    = ApiError
    | EmptyFieldError String


initNew : Maybe Date -> Model
initNew dateM =
    Model Creating dateM "" True Nothing Nothing (Err (EmptyFieldError ""))


initEdit : Activity -> Model
initEdit activity =
    Model (Editing activity.id) (Just activity.date) activity.description activity.completed (Just activity.duration) activity.pace (Ok activity)


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
    model.status == Creating && model.date == Just date


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
            Activity "" date description model.completed duration model.pace
        )
        (validateFieldExists model.date "date")
        (validateFieldExists (Just model.description) "description")
        (validateFieldExists model.duration "duration")


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
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

        ClickedSubmit ->
            case model.result of
                Ok activity ->
                    let
                        apiTask =
                            case model.status of
                                Editing id ->
                                    Api.saveActivity { activity | id = id }

                                Creating ->
                                    Api.createActivity (\id -> { activity | id = id })
                    in
                    ( model, Task.attempt GotSubmitResult (apiTask |> Task.mapError (\_ -> ApiError)) )

                Err error ->
                    ( model, Cmd.none )

        ClickedReset ->
            ( initNew model.date, Cmd.none )

        ClickedDelete ->
            case model.status of
                Editing id ->
                    ( initNew model.date, Task.attempt GotDeleteResult (Api.deleteActivity id |> Task.mapError (\_ -> ApiError)) )

                _ ->
                    ( initNew model.date, Cmd.none )

        ClickedMove ->
            let
                newModel =
                    { model | date = Nothing }
            in
            ( { newModel | result = validate newModel }, Cmd.none )

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


updateResult : Model -> Model
updateResult model =
    { model | result = validate model }


view : Model -> Html Msg
view model =
    let
        activityShape =
            validate model
                |> Result.toMaybe
                |> Maybe.map ActivityShape.view
                |> Maybe.withDefault (ActivityShape.viewDefault True Activity.Other)
    in
    row [ id "activity" ]
        [ compactColumn [ style "flex-basis" "5rem" ] [ activityShape ]
        , column []
            [ row []
                [ viewError model.result ]
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
            , row [ style "flex-wrap" "wrap" ]
                [ compactColumn [] [ durationInput EditedDuration model.duration ]
                , compactColumn [] [ paceSelect SelectedPace model.pace ]
                , compactColumn [] [ completedCheckbox model.completed ]
                ]
            , row [ style "flex-wrap" "wrap" ]
                [ compactColumn [] [ submitButton model.status ]
                , compactColumn []
                    [ button
                        [ onClick ClickedReset
                        , type_ "reset"
                        , style "margin-left" "1em"
                        ]
                        [ text "Reset" ]
                    ]
                , compactColumn [] [ deleteButton model.status ]
                , compactColumn []
                    [ button
                        [ onClick ClickedMove
                        , type_ "move"
                        , style "margin-left" "1em"
                        ]
                        [ text "Move" ]
                    ]
                ]
            ]
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
        , Html.label [] [ text "Completed" ]
        ]


submitButton : Status -> Html Msg
submitButton status =
    case status of
        Editing id ->
            button
                [ onClick ClickedSubmit
                , class "primary"
                , type_ "submit"
                ]
                [ text "Save" ]

        Creating ->
            button
                [ onClick ClickedSubmit
                , class "primary"
                , type_ "submit"
                ]
                [ text "Create" ]


deleteButton : Status -> Html Msg
deleteButton status =
    case status of
        Editing id ->
            button
                [ onClick ClickedDelete
                , name "delete"
                , style "margin-left" "1em"
                ]
                [ text "Delete" ]

        Creating ->
            div [] []


durationInput : (String -> Msg) -> Maybe Activity.Minutes -> Html Msg
durationInput msg duration =
    input
        [ type_ "number"
        , placeholder "Mins"
        , onInput msg
        , name "duration"
        , style "width" "3rem"
        , value (duration |> Maybe.map String.fromInt |> Maybe.withDefault "")
        ]
        []


paceSelect : (String -> Msg) -> Maybe Activity.Pace -> Html Msg
paceSelect msg paceM =
    let
        selected =
            case paceM of
                Just pace ->
                    Activity.pace.toString pace

                Nothing ->
                    ""

        selectedAttr paceStr =
            if selected == paceStr then
                [ Html.Attributes.attribute "selected" "" ]

            else
                []
    in
    Html.select
        [ onInput msg
        , name "pace"
        ]
        (List.map
            (\( paceStr, _ ) ->
                Html.option (selectedAttr paceStr) [ Html.text paceStr ]
            )
            (( "", Activity.Easy ) :: Activity.pace.list)
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

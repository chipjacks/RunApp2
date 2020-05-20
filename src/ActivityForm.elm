module ActivityForm exposing (Model, init, isEditing, save, selectDate, shift, update, viewActivity)

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
import Msg exposing (Msg(..))
import Skeleton exposing (column, compactColumn, expandingRow, row, viewIf)
import Store
import Task exposing (Task)



{- GOOD EXAMPLE:
   https://github.com/rtfeldman/elm-spa-example/blob/master/src/Page/Settings.elm
-}


type alias Model =
    { id : Activity.Id
    , date : Maybe Date
    , description : String
    , completed : Bool
    , duration : Maybe Minutes
    , pace : Maybe Activity.Pace
    , distance : Maybe Activity.Distance
    , result : Result Error Activity
    }


type Error
    = ApiError
    | EmptyFieldError String


init : Activity -> Model
init activity =
    Model activity.id (Just activity.date) activity.description activity.completed (Just activity.duration) activity.pace activity.distance (Ok activity)


save : Model -> Msg
save { result } =
    case result of
        Ok activity ->
            Update activity

        _ ->
            NoOp


delete : Model -> Msg
delete { result } =
    case result of
        Ok activity ->
            Delete activity

        _ ->
            NoOp


shift : Model -> Bool -> Msg
shift { result } up =
    case result of
        Ok activity ->
            Shift up activity

        _ ->
            NoOp


selectDate : Date -> Model -> Msg
selectDate date model =
    if model.date == Nothing then
        save (updateResult { model | date = Just date })

    else
        NoOp


isEditing : Activity -> Model -> Bool
isEditing activity { id } =
    activity.id == id


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
            Activity model.id date description model.completed duration model.pace model.distance
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
            ( model, Store.cmd (save model) )

        ClickedDelete ->
            ( model, Store.cmd (delete model) )

        ClickedMove ->
            ( { model | date = Nothing }, Cmd.none )

        ClickedShift up ->
            ( model, Store.cmd (shift model up) )

        _ ->
            ( model, Cmd.none )


updateResult : Model -> Model
updateResult model =
    { model | result = validate model }


viewForm : Model -> Html Msg
viewForm model =
    let
        activityShape =
            validate model
                |> Result.toMaybe
                |> Maybe.map ActivityShape.view
                |> Maybe.withDefault (ActivityShape.viewDefault True Activity.Other)
    in
    row [ id "activity", style "margin-bottom" "1rem" ]
        [ compactColumn [ style "flex-basis" "3.3rem", style "justify-content" "center" ] [ activityShape ]
        , column []
            [ row [ style "flex-wrap" "wrap" ]
                [ compactColumn [] [ shapeSelect model.completed ]
                , column [ style "align-items" "flex-end" ]
                    [ row [ style "align-items" "flex-start" ]
                        [ maybeView (Result.toMaybe model.result) (\activity -> a [ class "button tiny", style "margin-right" "0.2rem", onClick (ClickedCopy activity) ] [ i [ class "far fa-clone" ] [] ])
                        , a [ class "button tiny", style "margin-right" "0.2rem", onClick (ClickedShift True) ] [ i [ class "fas fa-arrow-up" ] [] ]
                        , a [ class "button tiny", style "margin-right" "0.2rem", onClick (ClickedShift False) ] [ i [ class "fas fa-arrow-down" ] [] ]
                        , a [ class "button tiny", style "margin-right" "0.2rem", onClick ClickedMove ] [ i [ class "fas fa-arrow-right" ] [] ]
                        , deleteButton
                        ]
                    ]
                ]
            , row []
                [ input
                    [ type_ "text"
                    , Html.Attributes.autocomplete False
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
                , column [ style "align-items" "flex-end" ] [ submitButton ]
                ]
            , row []
                [ viewError model.result ]
            ]
        ]


viewActivity : Maybe Model -> Activity -> Html Msg
viewActivity activityFormM activity =
    let
        level =
            Activity.mprLevel activity
                |> Maybe.map (\l -> "level " ++ String.fromInt l)
                |> Maybe.withDefault ""

        activityView =
            a [ onClick (EditActivity activity) ]
                [ row [ style "margin-bottom" "1rem" ]
                    [ compactColumn [ style "flex-basis" "5rem" ] [ ActivityShape.view activity ]
                    , column [ style "justify-content" "center" ]
                        [ row [] [ text activity.description ]
                        , row [ style "font-size" "0.8rem" ]
                            [ column [] [ text <| String.fromInt activity.duration ++ " min " ++ (Maybe.map Activity.pace.toString activity.pace |> Maybe.withDefault "" |> String.toLower) ]
                            , compactColumn [ style "align-items" "flex-end" ] [ text level ]
                            ]
                        ]
                    ]
                ]
    in
    case activityFormM of
        Just af ->
            if isEditing activity af then
                viewForm af

            else
                activityView

        Nothing ->
            activityView


shapeSelect : Bool -> Html Msg
shapeSelect completed =
    row []
        [ compactColumn [ onClick (SelectedShape Activity.Run) ] [ ActivityShape.viewDefault completed Activity.Run ]
        , compactColumn [ style "margin-left" "0.5rem", onClick (SelectedShape Activity.Race) ] [ ActivityShape.viewDefault completed Activity.Race ]
        , compactColumn [ style "margin-left" "0.5rem", onClick (SelectedShape Activity.Other) ] [ ActivityShape.viewDefault completed Activity.Other ]
        , compactColumn [ style "margin-left" "0.2rem" ] [ completedCheckbox completed ]
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


submitButton : Html Msg
submitButton =
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

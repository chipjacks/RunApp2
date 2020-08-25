module ActivityForm exposing (Model, init, isEditing, selectDate, update, viewActivity)

import Activity exposing (Activity, ActivityType, Minutes)
import ActivityShape
import Api
import Array exposing (Array)
import Date exposing (Date)
import Html exposing (Html, a, button, div, i, input, span, text)
import Html.Attributes exposing (class, href, id, name, placeholder, style, type_, value)
import Html.Events exposing (on, onClick, onInput)
import Http
import Json.Decode as Decode
import MPRLevel exposing (stripTimeStr)
import Msg exposing (Msg(..))
import Skeleton exposing (attributeIf, column, compactColumn, expandingRow, row, viewIf, viewMaybe)
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


apply : (Activity -> Msg) -> Model -> Msg
apply toMsg { result } =
    case result of
        Ok activity ->
            toMsg activity

        _ ->
            NoOp


selectDate : Date -> Model -> Msg
selectDate date model =
    if model.date == Nothing then
        apply (Move date) (updateResult { model | date = Just date })

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
            ( model, Store.cmd (apply Update model) )

        ClickedDelete ->
            ( model, Store.cmd (apply Delete model) )

        ClickedMove ->
            ( { model | date = Nothing }, Cmd.none )

        ClickedShift up ->
            ( model, Store.cmd (apply (Shift up) model) )

        _ ->
            ( model, Cmd.none )


updateResult : Model -> Model
updateResult model =
    { model | result = validate model }


viewForm : Model -> Maybe Int -> Html Msg
viewForm model levelM =
    let
        activityShape =
            validate model
                |> Result.toMaybe
                |> Maybe.map ActivityShape.view
                |> Maybe.withDefault (ActivityShape.viewDefault True Activity.Other)
    in
    row [ id "activity", style "margin-bottom" "1rem" ]
        [ compactColumn
            [ style "flex-basis" "3.3rem"
            , style "justify-content" "center"
            , Html.Events.onClick (CheckedCompleted (not model.completed))
            ]
            [ activityShape ]
        , column []
            [ row [ style "flex-wrap" "wrap" ]
                [ viewMaybe (Result.toMaybe model.result) (\activity -> a [ class "button small", style "margin-right" "0.2rem", onClick (ClickedCopy activity) ] [ i [ class "far fa-clone" ] [] ])
                , a [ class "button small", style "margin-right" "0.2rem", onClick (ClickedShift True) ] [ i [ class "fas fa-arrow-up" ] [] ]
                , a [ class "button small", style "margin-right" "0.2rem", onClick (ClickedShift False) ] [ i [ class "fas fa-arrow-down" ] [] ]
                , moreButtons
                , column [ style "align-items" "flex-end" ] [ submitButton ]
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
                [ compactColumn [] [ shapeSelect model SelectedShape ]
                , compactColumn [] [ durationInput EditedDuration model.duration ]
                , compactColumn [] [ viewMaybe model.pace (paceSelect levelM SelectedPace) ]
                , compactColumn [] [ viewMaybe model.distance (distanceSelect SelectedDistance) ]
                , compactColumn []
                    [ viewMaybe (Result.toMaybe model.result |> Maybe.andThen Activity.mprLevel)
                        (\level -> text <| "Level " ++ String.fromInt level)
                    ]
                ]
            , row []
                [ viewError model.result ]
            ]
        ]


viewActivity : Maybe Model -> Maybe Int -> Activity -> Html Msg
viewActivity activityFormM levelM activity =
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
                viewForm af levelM

            else
                activityView

        Nothing ->
            activityView


shapeSelect : Model -> (ActivityType -> Msg) -> Html Msg
shapeSelect model selectedShape =
    let
        aType =
            Result.toMaybe model.result
                |> Maybe.map Activity.activityType
                |> Maybe.withDefault Activity.Run
    in
    div [ class "dropdown medium" ]
        [ button [ class "button medium" ]
            [ text (Activity.activityTypeToString aType) ]
        , div [ class "dropdown-content" ]
            [ a [ onClick (SelectedShape Activity.Run) ] [ row [] [ ActivityShape.viewDefault model.completed Activity.Run, compactColumn [ style "margin-left" "0.5rem" ] [ text "Run" ] ] ]
            , a [ onClick (SelectedShape Activity.Race) ] [ row [] [ ActivityShape.viewDefault model.completed Activity.Race, compactColumn [ style "margin-left" "0.5rem" ] [ text "Race" ] ] ]
            , a [ onClick (SelectedShape Activity.Other) ] [ row [] [ ActivityShape.viewDefault model.completed Activity.Other, compactColumn [ style "margin-left" "0.5rem" ] [ text "Other" ] ] ]
            ]
        ]


submitButton : Html Msg
submitButton =
    a
        [ class "button small"
        , class "primary"
        , type_ "submit"
        , onClick ClickedSubmit
        ]
        [ i [ class "fas fa-check" ] [] ]


moreButtons : Html Msg
moreButtons =
    div [ class "dropdown" ]
        [ button [ class "button small", style "height" "100%" ]
            [ i [ class "fas fa-ellipsis-h" ] [] ]
        , div [ class "dropdown-content" ]
            [ a [ onClick ClickedMove ] [ i [ class "fas fa-arrow-right" ] [] ]
            , a [ onClick ClickedDelete ] [ i [ class "fas fa-times" ] [] ]
            ]
        ]


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


paceSelect : Maybe Int -> (String -> Msg) -> Activity.Pace -> Html Msg
paceSelect levelM msg pace =
    let
        paceNames =
            Activity.pace.list |> List.map Tuple.first

        paceTimes =
            case levelM of
                Just level ->
                    MPRLevel.trainingPaces ( MPRLevel.Neutral, level )
                        |> Result.map (List.map (\( name, ( minPace, maxPace ) ) -> stripTimeStr maxPace))
                        |> Result.withDefault (List.repeat (List.length Activity.pace.list) "")

                Nothing ->
                    List.repeat (List.length Activity.pace.list) ""
    in
    div [ class "dropdown medium" ]
        [ button [ class "button medium" ]
            [ text (Activity.pace.toString pace) ]
        , div [ class "dropdown-content" ]
            (List.map2
                (\name time ->
                    a [ onClick (msg name), style "text-align" "left" ] [ span [ style "color" "var(--accent-blue)", style "margin-right" "0.5rem" ] [ Html.text time ], Html.text name ]
                )
                paceNames
                paceTimes
            )
        ]


distanceSelect : (String -> Msg) -> Activity.Distance -> Html Msg
distanceSelect msg distance =
    div [ class "dropdown medium" ]
        [ button [ class "button medium" ]
            [ text (Activity.distance.toString distance) ]
        , div [ class "dropdown-content" ]
            (List.map
                (\( distanceOpt, _ ) ->
                    a [ onClick (msg distanceOpt), style "text-align" "left" ] [ Html.text distanceOpt ]
                )
                Activity.distance.list
            )
        ]


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

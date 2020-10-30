module ActivityForm exposing (Model, init, isEditing, selectDate, update, viewForm)

import Activity exposing (Activity, ActivityType, Minutes)
import ActivityShape
import Api
import Array exposing (Array)
import Date exposing (Date)
import Emoji
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
    , emoji : Maybe String
    , completed : Bool
    , duration : Maybe String
    , pace : Maybe Activity.Pace
    , distance : Maybe Activity.Distance
    , result : Result Error Activity
    }


type Error
    = ApiError
    | EmptyFieldError String


init : Activity -> Model
init activity =
    Model activity.id (Just activity.date) activity.description activity.emoji activity.completed (Maybe.map String.fromInt activity.duration) activity.pace activity.distance (Ok activity)


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
    Result.map2
        (\date description ->
            Activity model.id date description model.emoji model.completed (Maybe.andThen String.toInt model.duration) model.pace model.distance
        )
        (validateFieldExists model.date "date")
        (validateFieldExists (Just model.description) "description")


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SelectedShape activityType ->
            case activityType of
                Activity.Run mins pace_ ->
                    ( updateResult
                        { model
                            | pace = Just pace_
                            , distance = Nothing
                            , duration = Just (String.fromInt mins)
                            , emoji = Nothing
                        }
                    , Cmd.none
                    )

                Activity.Race mins dist ->
                    ( updateResult
                        { model
                            | pace = Nothing
                            , distance = Just dist
                            , duration = Just (String.fromInt mins)
                            , emoji = Nothing
                        }
                    , Cmd.none
                    )

                Activity.Other mins ->
                    ( updateResult
                        { model
                            | pace = Nothing
                            , distance = Nothing
                            , duration = Just (String.fromInt mins)
                            , emoji = Nothing
                        }
                    , Cmd.none
                    )

                Activity.Note emoji ->
                    ( updateResult
                        { model
                            | emoji = Just emoji
                            , pace = Nothing
                            , distance = Nothing
                            , duration = Nothing
                        }
                    , Cmd.none
                    )

        EditedDescription desc ->
            ( updateResult { model | description = desc }
            , Cmd.none
            )

        SelectedEmoji char ->
            ( updateResult { model | emoji = Just char }
            , Cmd.none
            )

        CheckedCompleted bool ->
            ( updateResult { model | completed = bool }
            , Cmd.none
            )

        EditedDuration str ->
            ( updateResult { model | duration = Just str }
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
                |> Maybe.withDefault (ActivityShape.viewDefault True (Activity.Run 30 Activity.Easy))
    in
    row []
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
                [ compactColumn [ style "margin-right" "0.2rem" ] [ shapeSelect model SelectedShape ]
                , compactColumn [] [ viewMaybe model.emoji (emojiSelect SelectedEmoji) ]
                , compactColumn [] [ viewMaybe model.duration (durationInput EditedDuration) ]
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


shapeSelect : Model -> (ActivityType -> Msg) -> Html Msg
shapeSelect model selectedShape =
    let
        types =
            [ ( "Run", toActivityType "Run" model )
            , ( "Race", toActivityType "Race" model )
            , ( "Other", toActivityType "Other" model )
            , ( "Note", toActivityType "Note" model )
            ]

        selected =
            Result.toMaybe model.result
                |> Maybe.map Activity.activityType
                |> Maybe.withDefault (Activity.Run 30 Activity.Easy)
    in
    div [ class "dropdown medium" ]
        [ button [ class "button medium" ]
            [ text (Activity.activityTypeToString selected) ]
        , div [ class "dropdown-content" ]
            (List.map
                (\( str, aType ) ->
                    a [ onClick (SelectedShape aType) ] [ row [] [ ActivityShape.viewDefault model.completed aType, compactColumn [ style "margin-left" "0.5rem" ] [ text str ] ] ]
                )
                types
            )
        ]


toActivityType : String -> Model -> ActivityType
toActivityType typeStr model =
    let
        mins =
            Maybe.andThen String.toInt model.duration |> Maybe.withDefault 30

        pace_ =
            Maybe.withDefault Activity.Easy model.pace

        dist =
            Maybe.withDefault Activity.FiveK model.distance

        emoji =
            Maybe.withDefault Emoji.default.name model.emoji
    in
    case typeStr of
        "Run" ->
            Activity.Run mins pace_

        "Race" ->
            Activity.Race mins dist

        "Other" ->
            Activity.Other mins

        _ ->
            Activity.Note emoji


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


emojiSelect : (String -> Msg) -> String -> Html Msg
emojiSelect msg emoji =
    let
        emojis =
            Emoji.filter (String.toLower emoji) |> List.take 10

        padding =
            style "padding" "3.5px 0.5rem 0.5px 0.5rem"

        emojiItem data =
            a [ onClick (SelectedEmoji data.name), style "text-align" "left", padding, style "white-space" "nowrap" ]
                [ Emoji.view data
                , div [ style "display" "inline-block", style "vertical-align" "top", style "margin-left" "0.5rem" ]
                    [ Html.text data.name ]
                ]
    in
    div [ class "row" ]
        [ div [ class "dropdown" ]
            [ div [ class "row" ]
                [ button
                    [ class "button"
                    , padding
                    , style "border-top-right-radius" "0"
                    , style "border-bottom-right-radius" "0"
                    ]
                    [ emojis
                        |> List.head
                        |> Maybe.withDefault Emoji.default
                        |> Emoji.view
                    ]
                , input
                    [ onInput msg
                    , class "input small icon"
                    , style "width" "6rem"
                    , value emoji
                    ]
                    []
                ]
            , div [ class "dropdown-content" ] (List.map emojiItem emojis)
            ]
        ]


durationInput : (String -> Msg) -> String -> Html Msg
durationInput msg duration =
    input
        [ type_ "number"
        , placeholder "Mins"
        , onInput msg
        , name "duration"
        , style "width" "3rem"
        , class "input small"
        , value duration
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

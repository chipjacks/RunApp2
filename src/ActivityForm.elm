module ActivityForm exposing (Model, init, isEditing, selectDate, update, viewForm)

import Activity exposing (Activity, ActivityData, Minutes)
import ActivityShape
import Api
import Array exposing (Array)
import Date exposing (Date)
import Emoji
import Html exposing (Html, a, button, div, i, input, span, text)
import Html.Attributes exposing (class, href, id, name, placeholder, style, type_, value)
import Html.Events exposing (on, onClick, onFocus, onInput)
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
    , dataType : String
    , duration : Maybe String
    , pace : Maybe Activity.Pace
    , distance : Maybe Activity.Distance
    , completed : Maybe Bool
    , emoji : Maybe String
    , result : Result Error Activity
    }


type Error
    = ApiError
    | EmptyFieldError String


init : Activity -> Model
init activity =
    let
        baseModel =
            Model activity.id (Just activity.date) activity.description
    in
    case activity.data of
        Activity.Run minutes pace_ completed ->
            baseModel "Run"
                (Just (String.fromInt minutes))
                (Just pace_)
                Nothing
                (Just completed)
                Nothing
                (Ok activity)

        Activity.Race minutes distance_ completed ->
            baseModel "Race"
                (Just (String.fromInt minutes))
                Nothing
                (Just distance_)
                (Just completed)
                Nothing
                (Ok activity)

        Activity.Other minutes completed ->
            baseModel "Other"
                (Just (String.fromInt minutes))
                Nothing
                Nothing
                (Just completed)
                Nothing
                (Ok activity)

        Activity.Note emoji_ ->
            baseModel "Note"
                Nothing
                Nothing
                Nothing
                Nothing
                (Just emoji_)
                (Ok activity)


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
            Activity
                model.id
                date
                description
                (toActivityData model.dataType model)
        )
        (validateFieldExists model.date "date")
        (validateFieldExists (Just model.description) "description")


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SelectedShape activityData ->
            let
                dataType =
                    Activity.activityTypeToString activityData
            in
            case activityData of
                Activity.Run mins pace_ completed ->
                    ( updateResult
                        { model
                            | dataType = dataType
                            , pace = Just pace_
                            , duration = Just (String.fromInt mins)
                            , completed = Just completed
                            , emoji = Nothing
                            , distance = Nothing
                        }
                    , Cmd.none
                    )

                Activity.Race mins dist completed ->
                    ( updateResult
                        { model
                            | dataType = dataType
                            , distance = Just dist
                            , duration = Just (String.fromInt mins)
                            , completed = Just completed
                            , pace = Nothing
                            , emoji = Nothing
                        }
                    , Cmd.none
                    )

                Activity.Other mins completed ->
                    ( updateResult
                        { model
                            | dataType = dataType
                            , duration = Just (String.fromInt mins)
                            , completed = Just completed
                            , distance = Nothing
                            , pace = Nothing
                            , emoji = Nothing
                        }
                    , Cmd.none
                    )

                Activity.Note emoji ->
                    ( updateResult
                        { model
                            | dataType = dataType
                            , emoji = Just emoji
                            , completed = Nothing
                            , distance = Nothing
                            , pace = Nothing
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
            ( updateResult { model | completed = Just bool }
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
    row [ style "margin-top" "1rem" ]
        [ viewShape model
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
                [ compactColumn [ style "margin-right" "0.2rem" ] [ shapeSelect model ]
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


viewShape : Model -> Html Msg
viewShape model =
    let
        activityShape =
            validate model
                |> Result.toMaybe
                |> Maybe.map ActivityShape.view
                |> Maybe.withDefault (ActivityShape.viewDefault True (Activity.Run 30 Activity.Easy True))
    in
    compactColumn
        [ style "flex-basis" "3.3rem"
        , style "justify-content" "center"
        , Html.Events.onClick (CheckedCompleted (not (Maybe.withDefault True model.completed)))
        ]
        [ activityShape ]


shapeSelect : Model -> Html Msg
shapeSelect model =
    let
        types =
            [ toActivityData "Run" model
            , toActivityData "Race" model
            , toActivityData "Other" model
            , toActivityData "Note" model
            ]
    in
    div [ class "dropdown medium" ]
        [ button [ class "button medium" ]
            [ text model.dataType ]
        , div [ class "dropdown-content" ]
            (List.map
                (\aType ->
                    a [ onClick (SelectedShape aType) ] [ row [] [ ActivityShape.viewDefault True aType, compactColumn [ style "margin-left" "0.5rem", style "margin-top" "0.1rem" ] [ text (Activity.activityTypeToString aType) ] ] ]
                )
                types
            )
        ]


toActivityData : String -> Model -> ActivityData
toActivityData dataType model =
    let
        mins =
            model.duration
                |> Maybe.andThen
                    (\str ->
                        if String.isEmpty str then
                            Just 0

                        else
                            String.toInt str
                    )
                |> Maybe.withDefault 30

        pace_ =
            Maybe.withDefault Activity.Easy model.pace

        dist =
            Maybe.withDefault Activity.FiveK model.distance

        completed =
            Maybe.withDefault True model.completed

        emoji =
            Maybe.withDefault Emoji.default.name model.emoji
    in
    case dataType of
        "Run" ->
            Activity.Run mins pace_ completed

        "Race" ->
            Activity.Race mins dist completed

        "Other" ->
            Activity.Other mins completed

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
                    , onFocus (msg "")
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
        , onFocus (msg "")
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

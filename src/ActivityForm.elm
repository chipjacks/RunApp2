module ActivityForm exposing (Model, init, isEditing, update, view)

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
import Msg exposing (DataForm(..), Msg(..))
import Skeleton exposing (attributeIf, borderStyle, column, compactColumn, expandingRow, row, viewIf, viewMaybe)
import Store
import Task exposing (Task)



{- GOOD EXAMPLE:
   https://github.com/rtfeldman/elm-spa-example/blob/master/src/Page/Settings.elm
-}


type alias Model =
    { id : Activity.Id
    , date : Maybe Date
    , description : String
    , result : Result Error Activity
    , dataForm : DataForm
    }


type Error
    = ApiError
    | EmptyFieldError String


init : Activity -> Model
init activity =
    let
        baseModel =
            Model activity.id (Just activity.date) activity.description (Ok activity)
    in
    baseModel <|
        case activity.data of
            Activity.Run minutes pace_ completed ->
                RunForm { duration = String.fromInt minutes, pace = pace_, completed = completed }

            Activity.Race minutes distance_ completed ->
                RaceForm { duration = String.fromInt minutes, distance = distance_, completed = completed }

            Activity.Other minutes completed ->
                OtherForm { duration = String.fromInt minutes, completed = completed }

            Activity.Note emoji_ ->
                NoteForm { emoji = emoji_ }


apply : (Activity -> Msg) -> Model -> Msg
apply toMsg { result } =
    case result of
        Ok activity ->
            toMsg activity

        _ ->
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
                (toActivityData model.dataForm)
        )
        (validateFieldExists model.date "date")
        (validateFieldExists (Just model.description) "description")


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SelectedDate date ->
            case model.date of
                Nothing ->
                    let
                        newModel =
                            updateResult { model | date = Just date }
                    in
                    ( newModel, Store.cmd (apply (Move date) newModel) )

                _ ->
                    ( model, Cmd.none )

        SelectedShape activityData ->
            case activityData of
                Activity.Run mins pace_ completed ->
                    ( updateResult
                        { model
                            | dataForm = RunForm { duration = String.fromInt mins, pace = pace_, completed = completed }
                        }
                    , Cmd.none
                    )

                Activity.Race mins dist completed ->
                    ( updateResult
                        { model
                            | dataForm = RaceForm { duration = String.fromInt mins, distance = dist, completed = completed }
                        }
                    , Cmd.none
                    )

                Activity.Other mins completed ->
                    ( updateResult
                        { model
                            | dataForm = OtherForm { duration = String.fromInt mins, completed = completed }
                        }
                    , Cmd.none
                    )

                Activity.Note emoji ->
                    ( updateResult
                        { model
                            | dataForm = NoteForm { emoji = emoji }
                        }
                    , Cmd.none
                    )

        EditedDescription desc ->
            ( updateResult { model | description = desc }
            , Cmd.none
            )

        SelectedEmoji char ->
            ( updateResult { model | dataForm = NoteForm { emoji = char } }
            , Cmd.none
            )

        CheckedCompleted ->
            ( updateResult { model | dataForm = updateCompleted model.dataForm }
            , Cmd.none
            )

        EditedDuration str ->
            ( updateResult { model | dataForm = updateDuration str model.dataForm }
            , Cmd.none
            )

        SelectedPace str ->
            ( updateResult { model | dataForm = updatePace str model.dataForm }
            , Cmd.none
            )

        SelectedDistance str ->
            ( updateResult { model | dataForm = updateDistance str model.dataForm }
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


updateCompleted : DataForm -> DataForm
updateCompleted dataForm =
    case dataForm of
        RunForm data ->
            RunForm { data | completed = not data.completed }

        RaceForm data ->
            RaceForm { data | completed = not data.completed }

        OtherForm data ->
            OtherForm { data | completed = not data.completed }

        _ ->
            dataForm


updateDuration : String -> DataForm -> DataForm
updateDuration duration dataForm =
    case dataForm of
        RunForm data ->
            RunForm { data | duration = duration }

        RaceForm data ->
            RaceForm { data | duration = duration }

        OtherForm data ->
            OtherForm { data | duration = duration }

        _ ->
            dataForm


updatePace : String -> DataForm -> DataForm
updatePace paceStr dataForm =
    case dataForm of
        RunForm data ->
            RunForm { data | pace = Activity.pace.fromString paceStr |> Maybe.withDefault (defaults dataForm |> .pace) }

        _ ->
            dataForm


updateDistance : String -> DataForm -> DataForm
updateDistance distanceStr dataForm =
    case dataForm of
        RaceForm data ->
            RaceForm { data | distance = Activity.distance.fromString distanceStr |> Maybe.withDefault (defaults dataForm |> .distance) }

        _ ->
            dataForm


updateResult : Model -> Model
updateResult model =
    { model | result = validate model }


view : Maybe Int -> Maybe Model -> Html Msg
view levelM modelM =
    let
        dataInputs form result =
            case form of
                RunForm { duration, pace } ->
                    [ compactColumn [] [ durationInput EditedDuration duration ]
                    , compactColumn [] [ paceSelect levelM SelectedPace pace ]
                    ]

                RaceForm { duration, distance } ->
                    [ compactColumn [] [ durationInput EditedDuration duration ]
                    , compactColumn [] [ distanceSelect SelectedDistance distance ]
                    , compactColumn []
                        [ viewMaybe (Result.toMaybe result |> Maybe.andThen Activity.mprLevel)
                            (\level -> text <| "Level " ++ String.fromInt level)
                        ]
                    ]

                OtherForm { duration } ->
                    [ compactColumn [] [ durationInput EditedDuration duration ] ]

                NoteForm { emoji } ->
                    [ compactColumn [] [ emojiSelect SelectedEmoji emoji ] ]
    in
    case modelM of
        Nothing ->
            row
                [ style "transition" "max-height 0.5s, min-height 0.5s, border-width 0.5s 0.1s"
                , style "min-height" "0"
                , style "max-height" "0"
                , borderStyle "border-bottom"
                , style "border-width" "0px"
                ]
                []

        Just model ->
            row
                [ style "transition" "max-height 1s, min-height 1s"
                , style "max-height" "20rem"
                , style "min-height" "5rem"
                , style "padding" "1rem 1rem 1rem 1rem"
                , borderStyle "border-bottom"
                , style "border-width" "1px"
                ]
                [ viewShape model
                , column []
                    [ row []
                        [ text (Maybe.map (Date.format "E MMM d") model.date |> Maybe.withDefault "Select Date")
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
                    , row [ style "flex-wrap" "wrap", style "align-items" "center" ] <|
                        compactColumn [ style "margin-right" "0.2rem" ] [ shapeSelect model ]
                            :: dataInputs model.dataForm model.result
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
        , Html.Events.onClick CheckedCompleted
        ]
        [ activityShape ]


shapeSelect : Model -> Html Msg
shapeSelect model =
    let
        { duration, pace, distance, emoji, completed } =
            defaults model.dataForm

        types =
            [ Activity.Run duration pace completed
            , Activity.Race duration distance completed
            , Activity.Other duration completed
            , Activity.Note emoji
            ]
    in
    div [ class "dropdown medium" ]
        [ button [ class "button medium" ]
            [ text (toActivityData model.dataForm |> Activity.activityTypeToString) ]
        , div [ class "dropdown-content" ]
            (List.map
                (\aType ->
                    a [ onClick (SelectedShape aType) ] [ row [] [ ActivityShape.viewDefault True aType, compactColumn [ style "margin-left" "0.5rem", style "margin-top" "0.1rem" ] [ text (Activity.activityTypeToString aType) ] ] ]
                )
                types
            )
        ]


type alias Defaults =
    { duration : Int, pace : Activity.Pace, distance : Activity.Distance, completed : Bool, emoji : String }


defaults : DataForm -> Defaults
defaults dataForm =
    let
        duration_ =
            parseDuration <|
                case dataForm of
                    RunForm { duration } ->
                        duration

                    RaceForm { duration } ->
                        duration

                    OtherForm { duration } ->
                        duration

                    _ ->
                        "30"

        pace_ =
            case dataForm of
                RunForm { pace } ->
                    pace

                _ ->
                    Activity.Easy

        distance_ =
            case dataForm of
                RaceForm { distance } ->
                    distance

                _ ->
                    Activity.FiveK

        completed_ =
            case dataForm of
                RunForm { completed } ->
                    completed

                RaceForm { completed } ->
                    completed

                OtherForm { completed } ->
                    completed

                _ ->
                    True

        emoji_ =
            case dataForm of
                NoteForm { emoji } ->
                    emoji

                _ ->
                    Emoji.default.name
    in
    Defaults duration_ pace_ distance_ completed_ emoji_


parseDuration : String -> Int
parseDuration str =
    if String.isEmpty str then
        0

    else
        String.toInt str |> Maybe.withDefault 0


toActivityData : DataForm -> ActivityData
toActivityData dataForm =
    case dataForm of
        RunForm { duration, pace, completed } ->
            Activity.Run (parseDuration duration) pace completed

        RaceForm { duration, distance, completed } ->
            Activity.Race (parseDuration duration) distance completed

        OtherForm { duration, completed } ->
            Activity.Other (parseDuration duration) completed

        NoteForm { emoji } ->
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


emojiSelect : (String -> Msg) -> String -> Html Msg
emojiSelect msg emoji =
    let
        emojis =
            Emoji.filter (String.toLower emoji) |> List.take 10

        padding =
            style "padding" "3.5px 0.5rem 0.5px 0.5rem"

        emojiItem data =
            a [ onClick (msg data.name), style "text-align" "left", padding, style "white-space" "nowrap" ]
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

module Activity exposing (Activity, ActivityType(..), Distance(..), Id, Minutes, Pace(..), activityType, activityTypeToString, decoder, distance, encoder, mprLevel, newId, pace)

import Date exposing (Date)
import Emoji
import Enum exposing (Enum)
import Json.Decode as Decode
import Json.Encode as Encode
import MPRLevel
import Random
import Task exposing (Task)


type alias Activity =
    { id : Id
    , date : Date
    , description : String
    , emoji : Maybe Char
    , completed : Bool
    , duration : Maybe Minutes
    , pace : Maybe Pace
    , distance : Maybe Distance
    }


type ActivityType
    = Run Minutes Pace
    | Race Minutes Distance
    | Other Minutes
    | Note Char


activityType : Activity -> ActivityType
activityType activity =
    case ( activity.pace, activity.distance, activity.duration ) of
        ( Nothing, Nothing, Nothing ) ->
            Note (activity.emoji |> Maybe.withDefault Emoji.default)

        ( Nothing, Nothing, Just mins ) ->
            Other mins

        ( _, Just dist, Just mins ) ->
            Race mins dist

        ( Just pace_, Nothing, Just mins ) ->
            Run mins pace_

        _ ->
            Note Emoji.default


activityTypeToString : ActivityType -> String
activityTypeToString aType =
    case aType of
        Run _ _ ->
            "Run"

        Race _ _ ->
            "Race"

        Other _ ->
            "Other"

        Note _ ->
            "Note"


newId : Random.Generator String
newId =
    let
        digitsToString digits =
            List.map String.fromInt digits
                |> String.join ""
    in
    Random.list 10 (Random.int 0 9)
        |> Random.map digitsToString


mprLevel : Activity -> Maybe Int
mprLevel activity =
    Maybe.map2
        (\dist duration ->
            MPRLevel.lookup MPRLevel.Neutral
                (distance.toString dist)
                (duration * 60)
                |> Result.map (\( rt, level ) -> level)
                |> Result.toMaybe
        )
        activity.distance
        activity.duration
        |> Maybe.withDefault Nothing


type alias Id =
    String


type alias Minutes =
    Int


type Pace
    = Easy
    | Moderate
    | Steady
    | Brisk
    | Aerobic
    | Lactate
    | Groove
    | VO2
    | Fast


pace : Enum Pace
pace =
    Enum.create
        [ Easy
        , Moderate
        , Steady
        , Brisk
        , Aerobic
        , Lactate
        , Groove
        , VO2
        , Fast
        ]
        (\a ->
            case a of
                Easy ->
                    "Easy"

                Moderate ->
                    "Moderate"

                Steady ->
                    "Steady"

                Brisk ->
                    "Brisk"

                Aerobic ->
                    "Aerobic"

                Lactate ->
                    "Lactate"

                Groove ->
                    "Groove"

                VO2 ->
                    "VO2"

                Fast ->
                    "Fast"
        )


type Distance
    = FiveK
    | EightK
    | FiveMile
    | TenK
    | FifteenK
    | TenMile
    | TwentyK
    | HalfMarathon
    | TwentyFiveK
    | ThirtyK
    | Marathon


distance : Enum Distance
distance =
    Enum.create
        [ FiveK
        , EightK
        , FiveMile
        , TenK
        , FifteenK
        , TenMile
        , TwentyK
        , HalfMarathon
        , TwentyFiveK
        , ThirtyK
        , Marathon
        ]
        (\a ->
            case a of
                FiveK ->
                    "5k"

                EightK ->
                    "8k"

                FiveMile ->
                    "5 mile"

                TenK ->
                    "10k"

                FifteenK ->
                    "15k"

                TenMile ->
                    "10 mile"

                TwentyK ->
                    "20k"

                HalfMarathon ->
                    "Half Marathon"

                TwentyFiveK ->
                    "25k"

                ThirtyK ->
                    "30k"

                Marathon ->
                    "Marathon"
        )



-- SERIALIZATION


decoder : Decode.Decoder Activity
decoder =
    Decode.map8 Activity
        (Decode.field "id" Decode.string)
        (Decode.field "date" dateDecoder)
        (Decode.field "description" Decode.string)
        (Decode.maybe (Decode.field "emoji" (Decode.int |> Decode.map Char.fromCode)))
        (Decode.field "completed" Decode.bool)
        (Decode.maybe (Decode.field "duration" Decode.int))
        (Decode.field "pace" (Decode.nullable pace.decoder))
        (Decode.maybe (Decode.field "distance" distance.decoder))


encoder : Activity -> Encode.Value
encoder activity =
    let
        paceEncoder =
            case activity.pace of
                Just pace_ ->
                    pace.encode pace_

                Nothing ->
                    Encode.null

        distanceEncoder =
            case activity.distance of
                Just distance_ ->
                    [ ( "distance", distance.encode distance_ ) ]

                Nothing ->
                    []
    in
    Encode.object <|
        [ ( "id", Encode.string activity.id )
        , ( "date", Encode.string (Date.toIsoString activity.date) )
        , ( "description", Encode.string activity.description )
        , ( "emoji", activity.emoji |> Maybe.map Char.toCode |> Maybe.map Encode.int |> Maybe.withDefault Encode.null )
        , ( "completed", Encode.bool activity.completed )
        , ( "duration", activity.duration |> Maybe.map Encode.int |> Maybe.withDefault Encode.null )
        , ( "pace", paceEncoder )
        ]
            ++ distanceEncoder


dateDecoder : Decode.Decoder Date
dateDecoder =
    let
        isoStringDecoder str =
            case Date.fromIsoString str of
                Ok date ->
                    Decode.succeed date

                Err _ ->
                    Decode.fail "Invalid date string"
    in
    Decode.string
        |> Decode.andThen isoStringDecoder

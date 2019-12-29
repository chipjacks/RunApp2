module Activity exposing (Activity, ActivityType(..), Distance(..), Id, Minutes, Pace(..), activityType, decoder, distance, encoder, mprLevel, pace)

import Date exposing (Date)
import Enum exposing (Enum)
import Json.Decode as Decode
import Json.Encode as Encode
import MPRLevel


type alias Activity =
    { id : Id
    , date : Date
    , description : String
    , completed : Bool
    , duration : Minutes
    , pace : Maybe Pace
    , distance : Maybe Distance
    }


type ActivityType
    = Run
    | Race
    | Other


activityType : Activity -> ActivityType
activityType activity =
    case ( activity.pace, activity.distance ) of
        ( Nothing, Nothing ) ->
            Other

        ( _, Just _ ) ->
            Race

        ( Just _, _ ) ->
            Run


mprLevel : Activity -> Maybe Int
mprLevel activity =
    activity.distance
        |> Maybe.andThen
            (\dist ->
                MPRLevel.lookup MPRLevel.Neutral
                    (distance.toString dist)
                    (activity.duration * 60)
                    |> Result.map (\( rt, level ) -> level)
                    |> Result.toMaybe
            )


type alias Id =
    String


type alias Minutes =
    Int


type Pace
    = Easy
    | Moderate
    | SteadyState
    | Brisk
    | AerobicThreshold
    | LactateThreshold
    | Groove
    | VO2Max
    | Fast


pace : Enum Pace
pace =
    Enum.create
        [ Easy
        , Moderate
        , SteadyState
        , Brisk
        , AerobicThreshold
        , LactateThreshold
        , Groove
        , VO2Max
        , Fast
        ]
        (\a ->
            case a of
                Easy ->
                    "Easy"

                Moderate ->
                    "Moderate"

                SteadyState ->
                    "Steady State"

                Brisk ->
                    "Brisk"

                AerobicThreshold ->
                    "Aerobic Threshold"

                LactateThreshold ->
                    "Lactate Threshold"

                Groove ->
                    "Groove"

                VO2Max ->
                    "VO2 Max"

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
    Decode.map7 Activity
        (Decode.field "id" Decode.string)
        (Decode.field "date" dateDecoder)
        (Decode.field "description" Decode.string)
        (Decode.field "completed" Decode.bool)
        (Decode.field "duration" Decode.int)
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
        , ( "completed", Encode.bool activity.completed )
        , ( "duration", Encode.int activity.duration )
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

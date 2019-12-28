module Activity exposing (Activity, ActivityType(..), Distance(..), Id, Minutes, Pace(..), activityType, decoder, distance, encoder, pace)

import Date exposing (Date)
import Enum exposing (Enum)
import Json.Decode as Decode
import Json.Encode as Encode


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
    = Mile
    | FiveK
    | TenK
    | HalfMarathon
    | Marathon


distance : Enum Distance
distance =
    Enum.create
        [ Mile
        , FiveK
        , TenK
        , HalfMarathon
        , Marathon
        ]
        (\a ->
            case a of
                Mile ->
                    "Mile"

                FiveK ->
                    "5k"

                TenK ->
                    "10k"

                HalfMarathon ->
                    "Half Marathon"

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

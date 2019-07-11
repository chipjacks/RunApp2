module Activity exposing (Activity, Details(..), Id, Minutes, Pace(..), decoder, encoder, pace)

import Date exposing (Date)
import Enum exposing (Enum)
import Json.Decode as Decode
import Json.Encode as Encode


type alias Activity =
    { id : Id
    , date : Date
    , description : String
    , completed : Bool
    , details : Details
    }


type alias Id =
    String


type Details
    = Run Minutes Pace
    | Other Minutes


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



-- SERIALIZATION


decoder : Decode.Decoder Activity
decoder =
    Decode.map5 Activity
        (Decode.field "id" Decode.string)
        (Decode.field "date" dateDecoder)
        (Decode.field "description" Decode.string)
        (Decode.field "completed" Decode.bool)
        detailsDecoder


detailsDecoder : Decode.Decoder Details
detailsDecoder =
    Decode.oneOf
        [ Decode.field "run" runDecoder
        , Decode.map Other <| Decode.field "other" (Decode.field "duration" Decode.int)
        ]


runDecoder : Decode.Decoder Details
runDecoder =
    Decode.map2 Run (Decode.field "duration" Decode.int) (Decode.field "pace" pace.decoder)


encoder : Activity -> Encode.Value
encoder activity =
    Encode.object
        [ ( "id", Encode.string activity.id )
        , ( "date", Encode.string (Date.toIsoString activity.date) )
        , ( "description", Encode.string activity.description )
        , ( "completed", Encode.bool activity.completed )
        , detailsEncoder activity.details
        ]


detailsEncoder : Details -> ( String, Encode.Value )
detailsEncoder details =
    case details of
        Run minutes pace_ ->
            ( "run"
            , Encode.object
                [ ( "duration", Encode.int minutes )
                , ( "pace", pace.encode pace_ )
                ]
            )

        Other duration ->
            ( "other", Encode.object [ ( "duration", Encode.int duration ) ] )


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

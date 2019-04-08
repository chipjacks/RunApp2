module Activity exposing (Activity, Details(..), Interval(..), Minutes, Pace(..), decoder, encoder, pace)

import Date exposing (Date)
import Enum exposing (Enum)
import Json.Decode as Decode
import Json.Encode as Encode


type alias Activity =
    { id : String
    , date : Date
    , description : String
    , details : Details
    }


type Details
    = Run Interval
    | Intervals (List Interval)
    | Other Minutes


type Interval
    = Interval Minutes Pace


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
    Decode.map4 Activity
        (Decode.field "id" Decode.string)
        (Decode.field "date" dateDecoder)
        (Decode.field "description" Decode.string)
        detailsDecoder


detailsDecoder : Decode.Decoder Details
detailsDecoder =
    Decode.oneOf
        [ Decode.map Run <| Decode.field "run" intervalDecoder
        , Decode.map Intervals <| Decode.field "intervals" (Decode.list intervalDecoder)
        , Decode.map Other <| Decode.field "other" (Decode.field "duration" Decode.int)
        ]


intervalDecoder : Decode.Decoder Interval
intervalDecoder =
    Decode.map2 Interval (Decode.field "duration" Decode.int) (Decode.field "pace" pace.decoder)


encoder : Activity -> Encode.Value
encoder activity =
    Encode.object
        [ ( "id", Encode.string activity.id )
        , ( "date", Encode.string (Date.toIsoString activity.date) )
        , ( "description", Encode.string activity.description )
        , detailsEncoder activity.details
        ]


detailsEncoder : Details -> ( String, Encode.Value )
detailsEncoder details =
    case details of
        Run interval ->
            ( "run", intervalEncoder interval )

        Intervals intervals ->
            ( "intervals", Encode.list intervalEncoder intervals )

        Other duration ->
            ( "other", Encode.object [ ( "duration", Encode.int duration ) ] )


intervalEncoder : Interval -> Encode.Value
intervalEncoder interval =
    case interval of
        Interval duration pace_ ->
            Encode.object
                [ ( "duration", Encode.int duration )
                , ( "pace", pace.encode pace_ )
                ]


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

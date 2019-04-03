module Activity exposing (Activity, Minutes, Pace, decoder, encoder, pace)

import Date exposing (Date)
import Enum exposing (Enum)
import Json.Decode as Decode
import Json.Encode as Encode


type alias Activity =
    { id : String
    , date : Date
    , description : String
    , duration : Minutes
    , pace : Pace
    }


type alias Minutes =
    Int


type Pace
    = Easy
    | Moderate
    | Hard


pace : Enum Pace
pace =
    Enum.create
        [ Easy
        , Moderate
        , Hard
        ]
        (\a ->
            case a of
                Easy ->
                    "easy"

                Moderate ->
                    "moderate"

                Hard ->
                    "hard"
        )



-- SERIALIZATION


decoder : Decode.Decoder Activity
decoder =
    Decode.map5 Activity
        (Decode.field "id" Decode.string)
        (Decode.field "date" dateDecoder)
        (Decode.field "description" Decode.string)
        (Decode.field "duration" Decode.int)
        (Decode.field "pace" pace.decoder)


encoder : Activity -> Encode.Value
encoder activity =
    Encode.object
        [ ( "id", Encode.string activity.id )
        , ( "date", Encode.string (Date.toIsoString activity.date) )
        , ( "description", Encode.string activity.description )
        , ( "duration", Encode.int activity.duration )
        , ( "pace", pace.encode activity.pace )
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

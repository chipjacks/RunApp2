module Activity exposing (Activity, decoder, encoder)

import Date exposing (Date)
import Json.Decode as Decode
import Json.Encode as Encode


type alias Activity =
    { id : String
    , date : Date
    , description : String
    }



-- SERIALIZATION


decoder : Decode.Decoder Activity
decoder =
    Decode.map3 Activity
        (Decode.field "id" Decode.string)
        (Decode.field "date" dateDecoder)
        (Decode.field "description" Decode.string)


encoder : Activity -> Encode.Value
encoder activity =
    Encode.object
        [ ( "id", Encode.string activity.id )
        , ( "date", Encode.string (Date.toIsoString activity.date) )
        , ( "description", Encode.string activity.description )
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

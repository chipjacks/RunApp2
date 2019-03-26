module Activity exposing (Activity, decoder, encoder)

import Date exposing (Date)
import Json.Decode as Decode
import Json.Encode as Encode


type alias Activity =
    { id : String
    , description : String
    }



-- SERIALIZATION


decoder : Decode.Decoder Activity
decoder =
    Decode.map2 Activity
        (Decode.field "id" Decode.string)
        (Decode.field "description" Decode.string)


encoder : Activity -> Encode.Value
encoder activity =
    Encode.object
        [ ( "id", Encode.string activity.id )
        , ( "description", Encode.string activity.description )
        ]

module Activity exposing (Activity, encode, resource)

import Json.Decode as Decode
import Json.Encode as Encode
import Kinto


type alias Activity =
    { id : Maybe String
    , description : String
    }


resource : Kinto.Resource Activity
resource =
    Kinto.recordResource "default" "activities" decoder


decoder : Decode.Decoder Activity
decoder =
    Decode.map2 Activity
        (Decode.field "id" Decode.string |> Decode.map Just)
        (Decode.field "description" Decode.string)


encode : Activity -> Encode.Value
encode activity =
    Encode.object
        [ ( "description", Encode.string activity.description )
        ]

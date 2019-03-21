module Activity exposing (Activity, NewActivity, Order, decoder, encoder, orderFromString, orderToString)

import Date exposing (Date)
import Json.Decode as Decode
import Json.Encode as Encode


type alias NewActivity =
    { id : Maybe String
    , description : String
    }


type alias Activity =
    { id : String
    , description : String
    }


type alias Order =
    { date : Date
    , session : Char
    , interval : Int
    }


{-|

    import Date
    import Time exposing (Month(..))

    orderFromString "2019-03-10+A1"
    --> Ok ( Order (Date.fromCalendarDate 2019 Mar 10) 'A' 1 )

    orderFromString "2019-03-10"
    --> Err "Failed to extract session"

    orderFromString "2019-03-10+A"
    --> Err "Failed to extract interval"

    orderFromString "garbage"
    --> Err "Failed to extract date"

-}
orderFromString : String -> Result String Order
orderFromString str =
    let
        date =
            String.slice 0 10 str
                |> Date.fromIsoString
                |> Result.mapError (\_ -> "Failed to extract date")

        session =
            String.slice 11 12 str
                |> String.uncons
                |> Maybe.map Tuple.first
                |> Result.fromMaybe "Failed to extract session"

        interval =
            String.slice 12 13 str
                |> String.toInt
                |> Result.fromMaybe "Failed to extract interval"
    in
    Result.map3 Order date session interval


{-|

    import Date
    import Time exposing (Month(..))

    orderToString (Order (Date.fromCalendarDate 2019 Mar 10) 'A' 1)
    --> "2019-03-10+A1"

-}
orderToString : Order -> String
orderToString order =
    let
        date =
            Date.toIsoString order.date

        session =
            String.fromChar order.session

        interval =
            String.fromInt order.interval
    in
    String.concat [ date, "+", session, interval ]



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

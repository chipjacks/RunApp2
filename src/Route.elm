module Route exposing (Route(..), fromUrl)

import Activity
import Date exposing (Date)
import Url exposing (Url)
import Url.Parser as Parser exposing ((<?>))
import Url.Parser.Query as Query


type Route
    = Calendar (Maybe Date)
    | Activities (Maybe Date)
    | Activity (Maybe Activity.Id)
    | Home


fromUrl : Url -> Maybe Route
fromUrl url =
    Parser.oneOf
        [ Parser.map
            (\dateM -> Calendar (Date.fromIsoString (Maybe.withDefault "" dateM) |> Result.toMaybe))
            (Parser.s "calendar" <?> Query.string "date")
        , Parser.map
            (\dateM -> Activities (Date.fromIsoString (Maybe.withDefault "" dateM) |> Result.toMaybe))
            (Parser.s "activities" <?> Query.string "date")
        , Parser.map
            Activity
            (Parser.s "activity" <?> Query.string "id")
        , Parser.map Home Parser.top
        ]
        |> (\parser -> Parser.parse parser url)

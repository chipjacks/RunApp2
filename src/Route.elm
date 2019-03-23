module Route exposing (Route(..), fromUrl)

import Date exposing (Date)
import Url exposing (Url)
import Url.Parser as Parser exposing ((<?>))
import Url.Parser.Query as Query


type Route
    = Calendar (Maybe Date)
    | Activities (Maybe Date)
    | Home


fromUrl : Url -> Maybe Route
fromUrl url =
    Parser.oneOf
        [ Parser.map
            (\rataDieM -> Calendar (Maybe.map Date.fromRataDie rataDieM))
            (Parser.s "calendar" <?> Query.int "date")
        , Parser.map
            (\rataDieM -> Activities (Maybe.map Date.fromRataDie rataDieM))
            (Parser.s "activities" <?> Query.int "date")
        , Parser.map Home Parser.top
        ]
        |> (\parser -> Parser.parse parser url)

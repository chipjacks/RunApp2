module Route exposing (Route(..), fromUrl)

import Activity
import Date exposing (Date)
import Url exposing (Url)
import Url.Parser as Parser exposing ((<?>))
import Url.Parser.Query as Query


type Route
    = Home (Maybe Activity.Id)


fromUrl : Url -> Maybe Route
fromUrl url =
    Parser.oneOf
        [ Parser.map
            Home
            (Parser.s "home" <?> Query.string "activity")
        ]
        |> (\parser -> Parser.parse parser url)

module Route exposing (Route(..), fromUrl)

import Home
import Url exposing (Url)
import Url.Parser as Parser exposing ((<?>))
import Url.Parser.Query as Query


type Route
    = Home Home.Msg


fromUrl : Url -> Maybe Route
fromUrl url =
    Parser.oneOf
        [ Parser.map Home
            (Parser.s "home" <?> Query.map2 Home.parseQueryParams (Query.string "activity") (Query.string "date"))
        ]
        |> (\parser -> Parser.parse parser url)

module Router exposing (Page(..), route)

import Url
import Url.Parser as Parser exposing (Parser, oneOf, s, top)


type Page
    = NotFound
    | Calendar
    | Blocks


route : Url.Url -> Page
route url =
    Maybe.withDefault NotFound
        (Parser.parse parser url)


parser : Parser (Page -> Page) Page
parser =
    oneOf
        [ Parser.map Calendar top
        , Parser.map Blocks (s "blocks")
        ]

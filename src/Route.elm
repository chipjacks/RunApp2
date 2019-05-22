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
        [ Parser.map Home Home.parseUrl
        ]
        |> (\parser -> Parser.parse parser (urlFragmentToPath url))


urlFragmentToPath : Url -> Url
urlFragmentToPath url =
    let
        path =
            url.fragment |> Maybe.withDefault "" |> String.split "?" |> List.head |> Maybe.withDefault ""

        query =
            url.fragment |> Maybe.withDefault "" |> String.split "?" |> List.tail |> Maybe.withDefault [] |> List.head
    in
    { url | path = path, query = query, fragment = Nothing }

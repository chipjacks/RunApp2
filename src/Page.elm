module Page exposing (Page(..), parseUrl, title)

import BlockList
import Calendar
import Html exposing (Html)
import Url
import Url.Parser as Parser exposing ((<?>), Parser, oneOf, s, top)
import Url.Parser.Query as Query


type Page
    = NotFound
    | Calendar Calendar.Model
    | BlockList BlockList.Model


title : Page -> String
title page =
    case page of
        Calendar _ ->
            "Calendar"

        BlockList _ ->
            "Block List"

        NotFound ->
            "Not Found"


parseUrl : Url.Url -> Page
parseUrl url =
    oneOf
        [ Parser.map (toPage Calendar) (s "calendar" <?> Calendar.urlParser)
        , Parser.map (toPage BlockList) (s "blocks" <?> BlockList.urlParser)
        ]
        |> (\parser -> Parser.parse parser url)
        |> Maybe.withDefault NotFound



-- INTERNAL


toPage : (a -> Page) -> Maybe a -> Page
toPage page maybeSubModel =
    case maybeSubModel of
        Just subModel ->
            page subModel

        Nothing ->
            NotFound

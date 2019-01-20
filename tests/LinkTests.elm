module LinkTests exposing (suite)

import Expect exposing (Expectation)
import Link
import Main exposing (Page(..), parseUrl)
import Test exposing (..)
import Url


matchesPage : String -> Page -> Expectation
matchesPage expectedPage actualPage =
    case actualPage of
        Calendar _ ->
            Expect.equal expectedPage "calendar"

        BlockList _ ->
            Expect.equal expectedPage "blocklist"

        NotFound ->
            Expect.equal expectedPage "notfound"


parseLink : String -> Page
parseLink link =
    ("http://example.com" ++ link)
        |> Url.fromString
        |> (\url ->
                case url of
                    Just u ->
                        parseUrl u

                    Nothing ->
                        Debug.todo ("Failed to build url from link: " ++ link)
           )


suite : Test
suite =
    describe "Link"
        [ test ".toCalendar" <|
            \_ ->
                Link.toCalendar { date = "date" }
                    |> parseLink
                    |> matchesPage "calendar"
        ]

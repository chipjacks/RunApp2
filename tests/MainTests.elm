module MainTests exposing (suite)

import Date
import Expect exposing (Expectation)
import Link
import Main exposing (Msg(..), parseUrl)
import Test exposing (..)
import Url


suite : Test
suite =
    describe ".parseUrl"
        [ test "Generates a SelectDate msg for calendar urls" <|
            \_ ->
                Link.toCalendar (Date.fromRataDie 123)
                    |> parseLink
                    |> Expect.equal (SelectDate (Date.fromRataDie 123))
        , test "Generates a SelectDate msg of blocklist urls" <|
            \_ ->
                Link.toBlockList (Date.fromRataDie 123)
                    |> parseLink
                    |> Expect.equal (SelectDate (Date.fromRataDie 123))
        ]



-- INTERNAL


parseLink : String -> Msg
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

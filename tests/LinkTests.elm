module LinkTests exposing (suite)

import Expect exposing (Expectation)
import Link
import Page exposing (Page(..), parseUrl)
import Test exposing (..)
import Url


suite : Test
suite =
    describe "Link"
        [ test ".toCalendar" <|
            \_ ->
                Link.toCalendar { date = "date" }
                    |> parseLink
                    |> Page.title
                    |> Expect.equal "Calendar"
        , test ".toBlockList" <|
            \_ ->
                Link.toBlockList { date = "date" }
                    |> parseLink
                    |> Page.title
                    |> Expect.equal "Block List"
        ]



-- INTERNAL


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

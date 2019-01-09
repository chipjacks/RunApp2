module Tests exposing (suite)

import Calendar
import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Html
import Test exposing (..)
import Test.Html.Query as Query
import Test.Html.Selector exposing (tag, text)


suite : Test
suite =
    describe "The Calendar page"
        [ test "displays a calendar" <|
            \_ ->
                Calendar.view
                    |> Query.fromHtml
                    |> Query.contains [ Html.text "Calendar" ]
        ]

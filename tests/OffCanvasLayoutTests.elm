module OffCanvasLayoutTests exposing (suite)

import Expect
import Html exposing (text)
import OffCanvasLayout exposing (..)
import Test exposing (..)
import Test.Html.Query as Query
import Test.Html.Selector as Selector
import Window exposing (Window)


suite : Test
suite =
    describe "OffCanvasLayout"
        [ describe ".view"
            [ test "phone portrait orientation has one column" <|
                \_ ->
                    view (Window 320 1000) First (text "col1") (text "col2") (text "col3")
                        |> Query.fromHtml
                        |> Expect.all
                            [ Query.has [ Selector.text "col1" ]
                            , Query.hasNot [ Selector.text "col2" ]
                            , Query.hasNot [ Selector.text "col3" ]
                            ]
            , test "phone landscape orientation has two columns" <|
                \_ ->
                    view (Window 660 1000) First (text "col1") (text "col2") (text "col3")
                        |> Query.fromHtml
                        |> Expect.all
                            [ Query.has [ Selector.text "col1" ]
                            , Query.has [ Selector.text "col2" ]
                            , Query.hasNot [ Selector.text "col3" ]
                            ]
            , test "desktop has three columns" <|
                \_ ->
                    view (Window 1000 1000) Third (text "col1") (text "col2") (text "col3")
                        |> Query.fromHtml
                        |> Expect.all
                            [ Query.has [ Selector.text "col1" ]
                            , Query.has [ Selector.text "col2" ]
                            , Query.has [ Selector.text "col3" ]
                            ]
            ]
        ]

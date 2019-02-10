module OffCanvasLayoutTests exposing (suite)

import Element exposing (Device, DeviceClass(..), Orientation(..), text)
import Expect
import OffCanvasLayout exposing (..)
import Test exposing (..)
import Test.Html.Query as Query
import Test.Html.Selector as Selector


suite : Test
suite =
    describe "OffCanvasLayout"
        [ describe ".view"
            [ test "phone portrait orientation has one column" <|
                \_ ->
                    view (Device Phone Portrait) First (text "col1") (text "col2") (text "col3")
                        |> Element.layout []
                        |> Query.fromHtml
                        |> Expect.all
                            [ Query.has [ Selector.text "col1" ]
                            , Query.hasNot [ Selector.text "col2" ]
                            , Query.hasNot [ Selector.text "col3" ]
                            ]
            , test "phone landscape orientation has two columns" <|
                \_ ->
                    view (Device Phone Landscape) First (text "col1") (text "col2") (text "col3")
                        |> Element.layout []
                        |> Query.fromHtml
                        |> Expect.all
                            [ Query.has [ Selector.text "col1" ]
                            , Query.has [ Selector.text "col2" ]
                            , Query.hasNot [ Selector.text "col3" ]
                            ]
            , test "tablet portrait orientation has two columns" <|
                \_ ->
                    view (Device Tablet Portrait) Third (text "col1") (text "col2") (text "col3")
                        |> Element.layout []
                        |> Query.fromHtml
                        |> Expect.all
                            [ Query.hasNot [ Selector.text "col1" ]
                            , Query.has [ Selector.text "col2" ]
                            , Query.has [ Selector.text "col3" ]
                            ]
            , test "desktop has three columns" <|
                \_ ->
                    view (Device Desktop Portrait) Third (text "col1") (text "col2") (text "col3")
                        |> Element.layout []
                        |> Query.fromHtml
                        |> Expect.all
                            [ Query.has [ Selector.text "col1" ]
                            , Query.has [ Selector.text "col2" ]
                            , Query.has [ Selector.text "col3" ]
                            ]
            ]
        ]

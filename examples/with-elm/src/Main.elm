module Main exposing (main)

import Html
import App exposing (init, update, view)
 
main : Program Never App.Model App.Msg
main =
    Html.program
        { init = init
        , update = update
        , view = view
        , subscriptions = always Sub.none
        }

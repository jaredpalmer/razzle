module App exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode


type alias Model =
    {counter: Int}


init : ( Model, Cmd Msg )
init =
    ( Model 0, Cmd.none )

decodeModel : Json.Decode.Decoder Model
decodeModel =
    Json.Decode.map Model
        (Json.Decode.field "counter" Json.Decode.int)

-- UPDATE


type Msg
    = Inc


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        Inc ->
            {model | counter = model.counter + 1} ! []



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "container" ]
        [ h1 []
            [ text "Elm SSR example"
            ]
        , p [] [ text "Click on the button below to increment the state." ]
        , div []
            [ button
                [ class "btn btn-primary"
                , onClick Inc
                ]
                [ text "+ 1" ]
            , text <| toString model
            ]
        , p [] [ text "A simple example of how to make Razzle and Elm work together!" ]
        ]

module Main exposing (..)

import Html exposing (..)


-- Model


type alias Model =
    { name : String }


init : ( Model, Cmd Msg )
init =
    { name = "Example Application" } ! []



-- Action


type Msg
    = NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            model ! []



-- View


view : Model -> Html Msg
view model =
    h1 [] [ text model.name ]



-- Program


main : Program Never Model Msg
main =
    program
        { init = init
        , view = view
        , update = update
        , subscriptions = (\_ -> Sub.none)
        }

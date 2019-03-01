module Activity exposing (Activity, NewActivity)


type alias NewActivity =
    { id : Maybe String
    , description : String
    }


type alias Activity =
    { id : String
    , description : String
    }

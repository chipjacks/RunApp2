module ExampleData exposing (marathon)

import Activity exposing (Activity)
import Date exposing (Date)
import Json.Decode as Decode
import Time


marathon : Date -> List Activity
marathon today =
    Decode.decodeString (Decode.list Activity.decoder) marathonData
        |> Result.withDefault []
        |> List.map
            (\a ->
                { a
                    | date = Date.add Date.Days (Date.diff Date.Days marathonDataShiftDate today) a.date
                }
            )


marathonDataShiftDate =
    Date.fromCalendarDate 2020 Time.Nov 18


marathonData =
    """
[
    {
      "id": "2854461774",
      "date": "2020-10-25",
      "description": "Brrrr, it's cold out",
      "data": {
        "type": "note",
        "emoji": "cold face"
      }
    },
    {
      "id": "5364106724",
      "date": "2020-10-26",
      "description": "",
      "data": {
        "type": "run",
        "duration": 40,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "1922612256",
      "date": "2020-10-26",
      "description": "Drills and strides",
      "data": {
        "type": "other",
        "duration": 10,
        "completed": true
      }
    },
    {
      "id": "7779322897",
      "date": "2020-10-26",
      "description": "Push ups and pull ups",
      "data": {
        "type": "other",
        "duration": 10,
        "completed": true
      }
    },
    {
      "id": "6299449947",
      "date": "2020-10-26",
      "description": "Core ",
      "data": {
        "type": "other",
        "duration": 10,
        "completed": true
      }
    },
    {
      "id": "2039267451",
      "date": "2020-10-27",
      "description": "",
      "data": {
        "type": "run",
        "duration": 43,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "0756448099",
      "date": "2020-10-27",
      "description": "10 x 25 second repeats ",
      "data": {
        "type": "run",
        "duration": 5,
        "pace": "Fast",
        "completed": true
      }
    },
    {
      "id": "6265286733",
      "date": "2020-10-27",
      "description": "",
      "data": {
        "type": "run",
        "duration": 10,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "6612342761",
      "date": "2020-10-27",
      "description": "",
      "data": {
        "type": "run",
        "duration": 10,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "6200874441",
      "date": "2020-10-28",
      "description": "Whatcom with Haley",
      "data": {
        "type": "run",
        "duration": 60,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "1974783863",
      "date": "2020-10-28",
      "description": "Core - McMillan Prehab 2",
      "data": {
        "type": "other",
        "duration": 20,
        "completed": true
      }
    },
    {
      "id": "6414764585",
      "date": "2020-10-29",
      "description": "",
      "data": {
        "type": "run",
        "duration": 20,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "1715195814",
      "date": "2020-10-29",
      "description": "",
      "data": {
        "type": "run",
        "duration": 20,
        "pace": "Lactate",
        "completed": true
      }
    },
    {
      "id": "6760980040",
      "date": "2020-10-29",
      "description": "",
      "data": {
        "type": "run",
        "duration": 20,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "8097663992",
      "date": "2020-10-29",
      "description": "",
      "data": {
        "type": "note",
        "emoji": "relieved"
      }
    },
    {
      "id": "7054993631",
      "date": "2020-10-30",
      "description": "GSF workout",
      "data": {
        "type": "other",
        "duration": 80,
        "completed": true
      }
    },
    {
      "id": "3140781990",
      "date": "2020-10-31",
      "description": "",
      "data": {
        "type": "run",
        "duration": 65,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "3424573397",
      "date": "2020-10-31",
      "description": "Drills and strides",
      "data": {
        "type": "other",
        "duration": 10,
        "completed": true
      }
    },
    {
      "id": "0895420820",
      "date": "2020-11-01",
      "description": "",
      "data": {
        "type": "run",
        "duration": 110,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "0278211413",
      "date": "2020-11-02",
      "description": "Rest day",
      "data": {
        "type": "note",
        "emoji": "sleeping"
      }
    },
    {
      "id": "8042267480",
      "date": "2020-11-02",
      "description": "",
      "data": {
        "type": "run",
        "duration": 35,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "6549715372",
      "date": "2020-11-02",
      "description": "Drills",
      "data": {
        "type": "other",
        "duration": 5,
        "completed": true
      }
    },
    {
      "id": "3709666331",
      "date": "2020-11-02",
      "description": "Push ups, pull ups",
      "data": {
        "type": "other",
        "duration": 5,
        "completed": true
      }
    },
    {
      "id": "2308418766",
      "date": "2020-11-03",
      "description": "",
      "data": {
        "type": "run",
        "duration": 45,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "3173947677",
      "date": "2020-11-03",
      "description": "10 x diagonals",
      "data": {
        "type": "run",
        "duration": 3,
        "pace": "Fast",
        "completed": true
      }
    },
    {
      "id": "2052379959",
      "date": "2020-11-03",
      "description": "",
      "data": {
        "type": "run",
        "duration": 15,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "4892765237",
      "date": "2020-11-03",
      "description": "Core - Prehab 2",
      "data": {
        "type": "other",
        "duration": 20,
        "completed": true
      }
    },
    {
      "id": "3446470684",
      "date": "2020-11-04",
      "description": "",
      "data": {
        "type": "run",
        "duration": 68,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "3140331619",
      "date": "2020-11-05",
      "description": "",
      "data": {
        "type": "run",
        "duration": 18,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "2975550897",
      "date": "2020-11-05",
      "description": "",
      "data": {
        "type": "run",
        "duration": 20,
        "pace": "Lactate",
        "completed": true
      }
    },
    {
      "id": "7092585828",
      "date": "2020-11-05",
      "description": "",
      "data": {
        "type": "run",
        "duration": 20,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "9188505945",
      "date": "2020-11-06",
      "description": "GSF workout ",
      "data": {
        "type": "other",
        "duration": 56,
        "completed": true
      }
    },
    {
      "id": "8098351316",
      "date": "2020-11-06",
      "description": "4:15 with Juan at Vet",
      "data": {
        "type": "run",
        "duration": 40,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "4483822905",
      "date": "2020-11-07",
      "description": "",
      "data": {
        "type": "run",
        "duration": 65,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "7978226473",
      "date": "2020-11-07",
      "description": "Drills",
      "data": {
        "type": "other",
        "duration": 5,
        "completed": true
      }
    },
    {
      "id": "5301385305",
      "date": "2020-11-08",
      "description": "Like 7:20 pace!",
      "data": {
        "type": "run",
        "duration": 105,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "2929873774",
      "date": "2020-11-09",
      "description": "Push ups, pull ups",
      "data": {
        "type": "other",
        "duration": 10,
        "completed": true
      }
    },
    {
      "id": "5552641529",
      "date": "2020-11-10",
      "description": "",
      "data": {
        "type": "run",
        "duration": 45,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "8459705049",
      "date": "2020-11-10",
      "description": "12 x diagonals ",
      "data": {
        "type": "run",
        "duration": 4,
        "pace": "Fast",
        "completed": true
      }
    },
    {
      "id": "6485315602",
      "date": "2020-11-10",
      "description": "",
      "data": {
        "type": "run",
        "duration": 15,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "9579056087",
      "date": "2020-11-10",
      "description": "Core",
      "data": {
        "type": "other",
        "duration": 20,
        "completed": true
      }
    },
    {
      "id": "3592388518",
      "date": "2020-11-11",
      "description": "",
      "data": {
        "type": "run",
        "duration": 20,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "2980336795",
      "date": "2020-11-11",
      "description": "Drills",
      "data": {
        "type": "other",
        "duration": 10,
        "completed": true
      }
    },
    {
      "id": "7373130301",
      "date": "2020-11-11",
      "description": "Padden tempo loop with Haley",
      "data": {
        "type": "run",
        "duration": 15,
        "pace": "Lactate",
        "completed": true
      }
    },
    {
      "id": "2839288710",
      "date": "2020-11-11",
      "description": "",
      "data": {
        "type": "run",
        "duration": 20,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "1161874880",
      "date": "2020-11-11",
      "description": "11/11 day - good vibes all around",
      "data": {
        "type": "note",
        "emoji": "smiley"
      }
    },
    {
      "id": "9752940445",
      "date": "2020-11-12",
      "description": "",
      "data": {
        "type": "run",
        "duration": 56,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "9875353623",
      "date": "2020-11-12",
      "description": "Core",
      "data": {
        "type": "other",
        "duration": 20,
        "completed": true
      }
    },
    {
      "id": "0076623577",
      "date": "2020-11-13",
      "description": "GSF workout ",
      "data": {
        "type": "other",
        "duration": 50,
        "completed": true
      }
    },
    {
      "id": "7008726984",
      "date": "2020-11-13",
      "description": "Bombed my interview, haven't been pooping or sleeping well",
      "data": {
        "type": "note",
        "emoji": "confounded"
      }
    },
    {
      "id": "2080385749",
      "date": "2020-11-13",
      "description": "Yog and swim with Brad",
      "data": {
        "type": "run",
        "duration": 40,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "3657245810",
      "date": "2020-11-13",
      "description": "Apple Watch + Strava",
      "data": {
        "type": "note",
        "emoji": "watch"
      }
    },
    {
      "id": "6328467847",
      "date": "2020-11-14",
      "description": "",
      "data": {
        "type": "run",
        "duration": 55,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "3303875266",
      "date": "2020-11-14",
      "description": "Drills and strides ",
      "data": {
        "type": "other",
        "duration": 10,
        "completed": true
      }
    },
    {
      "id": "9437098471",
      "date": "2020-11-15",
      "description": "7:23 pace for 16+ miles!",
      "data": {
        "type": "run",
        "duration": 123,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "7709803045",
      "date": "2020-11-15",
      "description": "To the ends of the urb",
      "data": {
        "type": "note",
        "emoji": "earth africa"
      }
    },
    {
      "id": "0279432358",
      "date": "2020-11-16",
      "description": "Push ups, pull ups",
      "data": {
        "type": "other",
        "duration": 10,
        "completed": true
      }
    },
    {
      "id": "4663425313",
      "date": "2020-11-17",
      "description": "",
      "data": {
        "type": "run",
        "duration": 60,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "8531919531",
      "date": "2020-11-17",
      "description": "Core",
      "data": {
        "type": "other",
        "duration": 20,
        "completed": true
      }
    },
    {
      "id": "2695522000",
      "date": "2020-11-18",
      "description": "",
      "data": {
        "type": "run",
        "duration": 20,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "6332183007",
      "date": "2020-11-18",
      "description": "Tempo with Haley",
      "data": {
        "type": "run",
        "duration": 24,
        "pace": "Aerobic",
        "completed": true
      }
    },
    {
      "id": "3105964116",
      "date": "2020-11-18",
      "description": "",
      "data": {
        "type": "run",
        "duration": 20,
        "pace": "Easy",
        "completed": true
      }
    },
    {
      "id": "5150728687",
      "date": "2020-11-19",
      "description": "Left hamstring tight",
      "data": {
        "type": "note",
        "emoji": "face with head bandage"
      }
    },
    {
      "id": "8980350698",
      "date": "2020-11-19",
      "description": "GSF workout ",
      "data": {
        "type": "other",
        "duration": 60,
        "completed": true
      }
    },
    {
      "id": "5283225418",
      "date": "2020-11-20",
      "description": "",
      "data": {
        "type": "run",
        "duration": 80,
        "pace": "Easy",
        "completed": false
      }
    },
    {
      "id": "6508788876",
      "date": "2020-11-22",
      "description": "",
      "data": {
        "type": "run",
        "duration": 120,
        "pace": "Easy",
        "completed": false
      }
    }
  ]
  """

require 'sinatra'

get '/activities.json' do
  headers 'Access-Control-Allow-Origin' => 'http://localhost:8000'
  activities =
    [ {id: "123", description: "Tempo Tuesday"},
      {id: "123", description: "Workout Wednesday"},
      {id: "123", description: "Fartlek Friday"},
    ]
  content_type :json
  activities.to_json
end

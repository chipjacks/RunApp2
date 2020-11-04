cat cypress/fixtures/activities.json.backup \
  | jq 'map({ id: .id, date: .date, description: .description, \
    data: (if .emoji then { type: "note", emoji: .emoji } \
    elif .duration and .pace then { type: "run", duration: .duration, pace: .pace, completed: .completed } \
    elif .distance then { type: "race", duration: .duration, distance: .distance, completed: .completed } \
    else { type: "other", duration: .duration, completed: .completed } end) })' \
  > cypress/fixtures/activities.json

migrate(
  (app) => {
    $ai.agents.delete(app, 'mentor-pragmatico')
  },
  (app) => {},
)

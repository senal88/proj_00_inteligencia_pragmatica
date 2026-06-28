migrate(
  (app) => {
    const directions = new Collection({
      name: 'directions',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'mission_json', type: 'json' },
        { name: 'medal_json', type: 'json' },
        { name: 'model_json', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(directions)

    const projects = new Collection({
      name: 'projects',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'title', type: 'text', required: true },
        {
          name: 'area',
          type: 'select',
          values: ['Marketing', 'Vendas', 'Produto', 'Operações', 'Pessoas', 'Capital'],
          required: true,
          maxSelect: 1,
        },
        { name: 'pgg_json', type: 'json' },
        { name: 'pmv_json', type: 'json' },
        { name: 'is_domino', type: 'bool' },
        {
          name: 'status',
          type: 'select',
          values: ['planned', 'in_progress', 'completed'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(projects)

    const problems = new Collection({
      name: 'problems',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'title', type: 'text', required: true },
        {
          name: 'area',
          type: 'select',
          values: ['Marketing', 'Vendas', 'Produto', 'Operações', 'Pessoas', 'Capital'],
          required: true,
          maxSelect: 1,
        },
        { name: 'scg_json', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(problems)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('problems'))
    app.delete(app.findCollectionByNameOrId('projects'))
    app.delete(app.findCollectionByNameOrId('directions'))
  },
)

migrate(
  (app) => {
    const usersId = '_pb_users_auth_'

    // 1. companies
    const companies = new Collection({
      name: 'companies',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          maxSelect: 1,
          values: ['Startup', 'Lifestyle/Boutique'],
        },
        { name: 'founder', type: 'text' },
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: usersId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(companies)

    // 2. quarters
    const quarters = new Collection({
      name: 'quarters',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        { name: 'year', type: 'number', required: true },
        {
          name: 'quarter_number',
          type: 'select',
          required: true,
          maxSelect: 1,
          values: ['T1', 'T2', 'T3', 'T4'],
        },
        {
          name: 'company_id',
          type: 'relation',
          required: true,
          collectionId: companies.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: usersId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(quarters)

    // 3. directions_structured
    const directionsStructured = new Collection({
      name: 'directions_structured',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        {
          name: 'company_id',
          type: 'relation',
          required: true,
          collectionId: companies.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'mission_statement', type: 'text' },
        { name: 'transformation', type: 'text' },
        { name: 'target_customer', type: 'text' },
        { name: 'behaviors', type: 'text' },
        {
          name: 'medal_scene_type',
          type: 'select',
          maxSelect: 1,
          values: ['Capital', 'Liberdade', 'Reconhecimento'],
        },
        { name: 'medal_scene_description', type: 'text' },
        { name: 'ideal_monday', type: 'text' },
        { name: 'what_stops_doing', type: 'text' },
        { name: 'team_size', type: 'number' },
        { name: 'expected_revenue', type: 'number' },
        { name: 'expected_profit', type: 'number' },
        { name: 'annual_revenue', type: 'number' },
        { name: 'annual_profit', type: 'number' },
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: usersId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(directionsStructured)

    // 4. area_models
    const areaModels = new Collection({
      name: 'area_models',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        {
          name: 'quarter_id',
          type: 'relation',
          required: true,
          collectionId: quarters.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        {
          name: 'area',
          type: 'select',
          required: true,
          maxSelect: 1,
          values: ['Marketing', 'Vendas', 'Produto', 'Operações'],
        },
        { name: 'contribution_goal', type: 'text' },
        { name: 'primary_indicator', type: 'text' },
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: usersId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(areaModels)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('area_models'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('directions_structured'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('quarters'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('companies'))
    } catch (_) {}
  },
)

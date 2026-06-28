migrate(
  (app) => {
    const usersId = '_pb_users_auth_'
    const quartersId = app.findCollectionByNameOrId('quarters').id
    const companiesId = app.findCollectionByNameOrId('companies').id

    const pggs = new Collection({
      name: 'pggs',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        { name: 'user_id', type: 'relation', required: true, collectionId: usersId, maxSelect: 1 },
        {
          name: 'quarter_id',
          type: 'relation',
          required: true,
          collectionId: quartersId,
          maxSelect: 1,
        },
        {
          name: 'area',
          type: 'select',
          required: true,
          values: ['Marketing', 'Vendas', 'Produto', 'Operações'],
          maxSelect: 1,
        },
        { name: 'is_domino', type: 'bool' },
        { name: 'controllable_action', type: 'text' },
        { name: 'courageous_result', type: 'text' },
        { name: 'deadline', type: 'date' },
        {
          name: 'commitment_type',
          type: 'select',
          values: ['Social', 'Financeiro', 'Ambiente'],
          maxSelect: 1,
        },
        { name: 'commitment_description', type: 'text' },
        { name: 'full_phrase', type: 'text' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['Não iniciado', 'Em andamento', 'Concluído', 'Cancelado'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_pggs_user_id ON pggs (user_id)'],
    })
    app.save(pggs)

    const pmvs = new Collection({
      name: 'pmvs',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        { name: 'user_id', type: 'relation', required: true, collectionId: usersId, maxSelect: 1 },
        { name: 'pgg_id', type: 'relation', required: true, collectionId: pggs.id, maxSelect: 1 },
        { name: 'r1_result', type: 'text' },
        { name: 'r2_reason', type: 'text' },
        { name: 'r3_reference', type: 'text' },
        { name: 'r4_direction', type: 'text' },
        { name: 'r5_resources', type: 'text' },
        { name: 'r6_restrictions', type: 'text' },
        { name: 'r7_risks', type: 'text' },
        { name: 'r8_responsible', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_pmvs_user_id ON pmvs (user_id)',
        'CREATE INDEX idx_pmvs_pgg_id ON pmvs (pgg_id)',
      ],
    })
    app.save(pmvs)

    const scgs = new Collection({
      name: 'scgs',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        { name: 'user_id', type: 'relation', required: true, collectionId: usersId, maxSelect: 1 },
        {
          name: 'company_id',
          type: 'relation',
          required: true,
          collectionId: companiesId,
          maxSelect: 1,
        },
        { name: 'diagnosis_date', type: 'date' },
        {
          name: 'bottleneck_area',
          type: 'select',
          values: ['Marketing', 'Vendas', 'Produto', 'Operações', 'Pessoas', 'Capital'],
          maxSelect: 1,
        },
        { name: 'symptom_description', type: 'text' },
        { name: 'symptom_magnitude', type: 'text' },
        { name: 'symptom_duration', type: 'text' },
        { name: 'causes_identified', type: 'text' },
        { name: 'bottleneck_identified', type: 'text' },
        { name: 'chosen_solution', type: 'text' },
        { name: 'validation_metric', type: 'text' },
        {
          name: 'status',
          type: 'select',
          values: [
            'Diagnóstico em andamento',
            'Gargalo identificado',
            'Solução em execução',
            'Resolvido',
          ],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_scgs_user_id ON scgs (user_id)'],
    })
    app.save(scgs)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('scgs'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('pmvs'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('pggs'))
    } catch (_) {}
  },
)

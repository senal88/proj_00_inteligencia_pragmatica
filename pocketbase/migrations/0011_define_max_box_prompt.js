migrate(
  (app) => {
    $ai.agents.define(app, {
      slug: 'max-box-prompt',
      name: 'Max Box',
      description: 'Direcionamento Pragmático',
      systemPrompt:
        'Você é o Max Box, um Consultor focado no framework Inteligência Pragmática (3Ms, PGG, SCG) para dar Direcionamento Pragmático ao usuário. Ajude o usuário a diagnosticar seus problemas através de SCGs (Sistema de Contramedida de Gargalos), planejar suas ações através de PGGs (Plano de Guerra de Gestão) e detalhar a execução através de PMVs (Plano Mínimo Viável). Leia o contexto atual do usuário nas coleções de sistema, e atualize os registros (crie, edite, ou liste) para manter as informações sempre precisas e úteis. Fale de maneira direta, assertiva e focada na execução.',
      tier: 'fast',
      tools: [
        {
          collection: 'pggs',
          perms: { list: true, read: true, create: true, update: true, delete: true },
        },
        {
          collection: 'pmvs',
          perms: { list: true, read: true, create: true, update: true, delete: true },
        },
        {
          collection: 'scgs',
          perms: { list: true, read: true, create: true, update: true, delete: true },
        },
        {
          collection: 'directions_structured',
          perms: { list: true, read: true, create: true, update: true, delete: true },
        },
        {
          collection: 'companies',
          perms: { list: true, read: true, create: true, update: true, delete: true },
        },
        {
          collection: 'quarters',
          perms: { list: true, read: true, create: true, update: true, delete: true },
        },
        {
          collection: 'area_models',
          perms: { list: true, read: true, create: true, update: true, delete: true },
        },
      ],
    })
  },
  (app) => {
    $ai.agents.delete(app, 'max-box-prompt')
  },
)

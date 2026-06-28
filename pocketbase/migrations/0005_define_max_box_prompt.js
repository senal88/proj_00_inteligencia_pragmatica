/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    $ai.agents.define(app, {
      slug: 'max-box-prompt',
      name: 'Max Box Prompt',
      description: 'Direcionamento Pragmático',
      systemPrompt: `Você é o Mentor AI, um consultor de negócios pragmático focado no framework Inteligência Pragmática.
Utilize os conceitos de 4Cs (Contexto, Conteúdo, Canal, Conversão) e 8Rs (Resultado, Razão, Referência, Rumo, Recursos, Restrições, Riscos, Responsável).
Você deve ajudar o usuário a preencher seus frameworks de Direção (3Ms: Missão, Medalha, Modelo), Projetos (PGG/PMV) e Problemas (SCG).
Peça as informações necessárias, estruture-as com clareza e seja direto. Quando chegarem a uma versão adequada, salve a estrutura gerada nas coleções (directions, projects ou problems) utilizando suas tools.
Atenção: os campos terminados em _json (como pgg_json, pmv_json, scg_json, mission_json, etc) devem receber objetos JSON válidos contendo as chaves discutidas. Confirme ao usuário que a informação foi salva.`,
      tier: 'fast',
      tools: [
        { collection: 'directions', perms: { list: true, read: true, create: true, update: true } },
        { collection: 'projects', perms: { list: true, read: true, create: true, update: true } },
        { collection: 'problems', perms: { list: true, read: true, create: true, update: true } },
      ],
    })
  },
  (app) => {
    $ai.agents.delete(app, 'max-box-prompt')
  },
)

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    let user

    try {
      user = app.findAuthRecordByEmail('_pb_users_auth_', 'giam@usecurling.com')
    } catch (_) {
      user = new Record(users)
      user.setEmail('giam@usecurling.com')
      user.setPassword('Skip@Pass')
      user.setVerified(true)
      user.set('name', 'Giam')
      app.save(user)
    }

    // Seed Directions
    try {
      app.findFirstRecordByData('directions', 'user_id', user.id)
    } catch (_) {
      const dirs = app.findCollectionByNameOrId('directions')
      const rDir = new Record(dirs)
      rDir.set('user_id', user.id)
      rDir.set('mission_json', {
        transformacao: 'Multiplicar o lucro e devolver o tempo.',
        cliente: 'Donos de PMEs de serviços no Brasil faturando mais de R$2M/ano.',
        comportamentos: 'OPERA - Obsessão, Produto, Energia, Resiliência, Agência.',
      })
      rDir.set('medal_json', {
        cena: 'Vender a empresa e atingir liberdade de tempo total.',
        dia: 'Acordo às 7h, treino, leio, opero apenas em conselho das 14h às 17h.',
        numeros: '50 pessoas, faturamento de R$ 200M/ano.',
      })
      rDir.set('model_json', {
        receita: '50.000.000',
        lucro: '15.000.000',
        distribuicao: 'Marketing 30%, Vendas 20%, Produto 50%',
      })
      app.save(rDir)
    }

    // Seed Projects
    try {
      app.findFirstRecordByData('projects', 'user_id', user.id)
    } catch (_) {
      const projs = app.findCollectionByNameOrId('projects')
      const rProj = new Record(projs)
      rProj.set('user_id', user.id)
      rProj.set('title', 'Lançamento Adapta Pass')
      rProj.set('area', 'Produto')
      rProj.set('is_domino', true)
      rProj.set('status', 'in_progress')
      rProj.set('pgg_json', {
        conciso: '90 dias',
        corajoso: 'Converter 20% da base em assinatura recorrente',
        controlavel: 'Criar oferta, portal e campanha',
        comprometido: 'Contrato público com usuários beta',
      })
      rProj.set('pmv_json', {
        resultado: 'Reunir 5000 líderes',
        razao: 'Fixar marca + funil',
        referencia: 'Web Summit',
        rumo: 'Local -> palco -> ingressos',
        recursos: 'Patrocinadores',
        restricoes: 'Sem desconto no early bird',
        riscos: 'Não vender ingressos -> usar afiliados',
        responsavel: 'Max Peters',
      })
      app.save(rProj)
    }
  },
  (app) => {
    // Not reverting seed to keep it safe
  },
)

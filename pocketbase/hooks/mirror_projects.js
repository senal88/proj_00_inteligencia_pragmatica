onRecordAfterCreateSuccess((e) => {
  try {
    const userId = e.record.get('user_id')
    if (!userId) return e.next()

    let quarterId = ''
    try {
      const q = $app.findFirstRecordByFilter('quarters', 'user_id={:uid}', { uid: userId })
      quarterId = q.id
    } catch (_) {
      let compId = ''
      try {
        const c = $app.findFirstRecordByFilter('companies', 'user_id={:uid}', { uid: userId })
        compId = c.id
      } catch (_) {
        const colC = $app.findCollectionByNameOrId('companies')
        const nc = new Record(colC)
        nc.set('user_id', userId)
        nc.set('name', 'Minha Empresa')
        nc.set('type', 'Startup')
        $app.save(nc)
        compId = nc.id
      }
      const colQ = $app.findCollectionByNameOrId('quarters')
      const nq = new Record(colQ)
      nq.set('user_id', userId)
      nq.set('company_id', compId)
      nq.set('year', new Date().getFullYear())
      nq.set('quarter_number', 'T1')
      $app.save(nq)
      quarterId = nq.id
    }

    const pggJson = e.record.get('pgg_json') || {}
    const pmvJson = e.record.get('pmv_json') || {}
    const title = e.record.get('title') || ''

    if (Object.keys(pggJson).length > 0 || title) {
      const pggCol = $app.findCollectionByNameOrId('pggs')
      const pgg = new Record(pggCol)
      pgg.set('user_id', userId)
      pgg.set('quarter_id', quarterId)

      const area = e.record.get('area')
      const validAreas = ['Marketing', 'Vendas', 'Produto', 'Operações']
      pgg.set('area', validAreas.includes(area) ? area : 'Operações')

      pgg.set('is_domino', e.record.get('is_domino') || false)
      pgg.set('controllable_action', pggJson.controlavel || title)
      pgg.set('courageous_result', pggJson.corajoso || '')
      pgg.set('commitment_type', 'Financeiro')
      pgg.set('commitment_description', '')
      pgg.set('full_phrase', pggJson.comprometido || '')
      pgg.set('status', 'Não iniciado')
      $app.save(pgg)

      if (Object.keys(pmvJson).length > 0 || pgg.get('is_domino')) {
        const pmvCol = $app.findCollectionByNameOrId('pmvs')
        const pmv = new Record(pmvCol)
        pmv.set('user_id', userId)
        pmv.set('pgg_id', pgg.id)
        pmv.set('r1_result', pmvJson.resultado || '')
        pmv.set('r2_reason', pmvJson.razao || '')
        pmv.set('r3_reference', pmvJson.referencia || '')
        pmv.set('r4_direction', pmvJson.rumo || '')
        pmv.set('r5_resources', pmvJson.recursos || '')
        pmv.set('r6_restrictions', pmvJson.restricoes || '')
        pmv.set('r7_risks', pmvJson.riscos || '')
        pmv.set('r8_responsible', pmvJson.responsavel || '')
        $app.save(pmv)
      }
    }
  } catch (err) {
    $app.logger().error('mirror projects hook err', 'error', err.message)
  }
  return e.next()
}, 'projects')

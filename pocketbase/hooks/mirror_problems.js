onRecordAfterCreateSuccess((e) => {
  try {
    const userId = e.record.get('user_id')
    if (!userId) return e.next()

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

    const scgJson = e.record.get('scg_json') || {}
    const title = e.record.get('title') || ''

    if (Object.keys(scgJson).length > 0 || title) {
      const scgCol = $app.findCollectionByNameOrId('scgs')
      const scg = new Record(scgCol)
      scg.set('user_id', userId)
      scg.set('company_id', compId)
      scg.set('bottleneck_area', e.record.get('area') || 'Operações')
      scg.set('symptom_description', scgJson.sintoma || title)
      scg.set('causes_identified', scgJson.causa || '')
      scg.set('bottleneck_identified', scgJson.gargalo || '')
      scg.set('chosen_solution', scgJson.solucao || '')
      scg.set('status', 'Diagnóstico em andamento')
      $app.save(scg)
    }
  } catch (err) {
    $app.logger().error('mirror problems hook err', 'error', err.message)
  }
  return e.next()
}, 'problems')

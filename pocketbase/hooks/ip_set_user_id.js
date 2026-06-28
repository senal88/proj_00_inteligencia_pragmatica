onRecordCreateRequest(
  (e) => {
    if (e.auth && e.auth.id) {
      if (!e.record.get('user_id')) {
        e.record.set('user_id', e.auth.id)
      }
    }
    e.next()
  },
  'companies',
  'quarters',
  'directions_structured',
  'area_models',
)

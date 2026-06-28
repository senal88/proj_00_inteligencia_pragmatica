onRecordValidate(
  (e) => {
    if (e.auth && e.auth.collection().name === 'users') {
      if (!e.record.get('user_id')) {
        e.record.set('user_id', e.auth.id)
      } else if (e.record.get('user_id') !== e.auth.id) {
        e.record.set('user_id', e.auth.id)
      }
    }
    return e.next()
  },
  'directions',
  'projects',
  'problems',
)

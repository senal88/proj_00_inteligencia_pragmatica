migrate(
  (app) => {
    try {
      const user = app.findAuthRecordByEmail('_pb_users_auth_', 'giam@usecurling.com')

      try {
        app.findFirstRecordByData('companies', 'user_id', user.id)
        return
      } catch (_) {}

      const companies = app.findCollectionByNameOrId('companies')
      const company = new Record(companies)
      company.set('name', 'Curling Tech')
      company.set('type', 'Startup')
      company.set('founder', 'Giam')
      company.set('user_id', user.id)
      app.save(company)

      const quarters = app.findCollectionByNameOrId('quarters')
      const quarter = new Record(quarters)
      quarter.set('year', new Date().getFullYear())
      quarter.set('quarter_number', 'T1')
      quarter.set('company_id', company.id)
      quarter.set('user_id', user.id)
      app.save(quarter)
    } catch (err) {
      console.log('Seed skipped: ' + err.message)
    }
  },
  (app) => {
    try {
      const user = app.findAuthRecordByEmail('_pb_users_auth_', 'giam@usecurling.com')
      try {
        const quarter = app.findFirstRecordByData('quarters', 'user_id', user.id)
        app.delete(quarter)
      } catch (_) {}
      try {
        const company = app.findFirstRecordByData('companies', 'user_id', user.id)
        app.delete(company)
      } catch (_) {}
    } catch (_) {}
  },
)

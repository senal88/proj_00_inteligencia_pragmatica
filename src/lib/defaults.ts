import pb from '@/lib/pocketbase/client'

export async function getDefaultQuarterAndCompany() {
  if (!pb.authStore.record?.id) throw new Error('Not logged in')
  const userId = pb.authStore.record.id

  let companyId = ''
  try {
    const companies = await pb
      .collection('companies')
      .getFullList({ filter: `user_id = "${userId}"`, limit: 1 })
    if (companies.length > 0) {
      companyId = companies[0].id
    } else {
      const nc = await pb
        .collection('companies')
        .create({ user_id: userId, name: 'Minha Empresa', type: 'Startup' })
      companyId = nc.id
    }
  } catch (e) {
    const nc = await pb
      .collection('companies')
      .create({ user_id: userId, name: 'Minha Empresa', type: 'Startup' })
    companyId = nc.id
  }

  let quarterId = ''
  try {
    const quarters = await pb
      .collection('quarters')
      .getFullList({ filter: `user_id = "${userId}"`, limit: 1 })
    if (quarters.length > 0) {
      quarterId = quarters[0].id
    } else {
      const nq = await pb.collection('quarters').create({
        user_id: userId,
        company_id: companyId,
        year: new Date().getFullYear(),
        quarter_number: 'T1',
      })
      quarterId = nq.id
    }
  } catch (e) {
    const nq = await pb.collection('quarters').create({
      user_id: userId,
      company_id: companyId,
      year: new Date().getFullYear(),
      quarter_number: 'T1',
    })
    quarterId = nq.id
  }

  return { companyId, quarterId }
}

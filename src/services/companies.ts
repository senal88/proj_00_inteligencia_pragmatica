import pb from '@/lib/pocketbase/client'

export interface Company {
  id: string
  name: string
  type: 'Startup' | 'Lifestyle/Boutique'
  founder?: string
  user_id: string
}

export const getCompanies = async () => {
  return pb.collection('companies').getFullList<Company>()
}

export const getDefaultCompany = async () => {
  const companies = await getCompanies()
  if (companies.length > 0) return companies[0]
  if (!pb.authStore.record?.id) throw new Error('Not logged in')
  return pb.collection('companies').create<Company>({
    name: 'Minha Empresa',
    type: 'Startup',
    user_id: pb.authStore.record.id,
  })
}

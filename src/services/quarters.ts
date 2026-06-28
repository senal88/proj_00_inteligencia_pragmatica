import pb from '@/lib/pocketbase/client'

export interface Quarter {
  id: string
  year: number
  quarter_number: 'T1' | 'T2' | 'T3' | 'T4'
  company_id: string
  user_id: string
}

export const getQuarters = async (companyId: string) => {
  return pb.collection('quarters').getFullList<Quarter>({
    filter: `company_id = "${companyId}"`,
    sort: '-year,-quarter_number',
  })
}

export const createQuarter = async (data: Partial<Quarter>) => {
  if (!pb.authStore.record?.id) throw new Error('Not logged in')
  return pb.collection('quarters').create<Quarter>({
    ...data,
    user_id: pb.authStore.record.id,
  })
}

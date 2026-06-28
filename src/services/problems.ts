import pb from '@/lib/pocketbase/client'

export interface Problem {
  id?: string
  user_id?: string
  title: string
  area: 'Marketing' | 'Vendas' | 'Produto' | 'Operações' | 'Pessoas' | 'Capital'
  scg_json?: any
}

export const getProblems = async () => {
  try {
    return await pb.collection('problems').getFullList<Problem>({ sort: '-created' })
  } catch {
    return []
  }
}

export const saveProblem = async (data: Partial<Problem>) => {
  if (!pb.authStore.record?.id) throw new Error('Not logged in')

  if (data.id) {
    return pb.collection('problems').update<Problem>(data.id, data)
  }
  return pb.collection('problems').create<Problem>({ ...data, user_id: pb.authStore.record.id })
}

export const deleteProblem = async (id: string) => {
  return pb.collection('problems').delete(id)
}

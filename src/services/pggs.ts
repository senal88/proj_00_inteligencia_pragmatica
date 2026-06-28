import pb from '@/lib/pocketbase/client'

export interface PGG {
  id?: string
  user_id?: string
  quarter_id: string
  area: 'Marketing' | 'Vendas' | 'Produto' | 'Operações'
  is_domino?: boolean
  controllable_action?: string
  courageous_result?: string
  deadline?: string
  commitment_type?: 'Social' | 'Financeiro' | 'Ambiente' | ''
  commitment_description?: string
  full_phrase?: string
  status?: 'Não iniciado' | 'Em andamento' | 'Concluído' | 'Cancelado'
  created?: string
}

export const getPGGs = async (quarterId: string) => {
  try {
    return await pb.collection('pggs').getFullList<PGG>({
      filter: `quarter_id = "${quarterId}"`,
      sort: '-created',
    })
  } catch {
    return []
  }
}

export const savePGG = async (data: Partial<PGG>) => {
  if (!pb.authStore.record?.id) throw new Error('Not logged in')

  if (data.id) {
    return pb.collection('pggs').update<PGG>(data.id, data)
  }
  return pb.collection('pggs').create<PGG>({
    ...data,
    user_id: pb.authStore.record.id,
    status: data.status || 'Não iniciado',
  })
}

export const deletePGG = async (id: string) => {
  return pb.collection('pggs').delete(id)
}

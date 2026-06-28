import pb from '@/lib/pocketbase/client'

export interface SCG {
  id?: string
  user_id?: string
  company_id: string
  diagnosis_date?: string
  bottleneck_area?: 'Marketing' | 'Vendas' | 'Produto' | 'Operações' | 'Pessoas' | 'Capital'
  symptom_description?: string
  symptom_magnitude?: string
  symptom_duration?: string
  causes_identified?: string
  bottleneck_identified?: string
  chosen_solution?: string
  validation_metric?: string
  status?: 'Diagnóstico em andamento' | 'Gargalo identificado' | 'Solução em execução' | 'Resolvido'
  created?: string
}

export const getSCGs = async () => {
  try {
    return await pb.collection('scgs').getFullList<SCG>({ sort: '-created' })
  } catch {
    return []
  }
}

export const saveSCG = async (data: Partial<SCG>) => {
  if (!pb.authStore.record?.id) throw new Error('Not logged in')

  if (data.id) {
    return pb.collection('scgs').update<SCG>(data.id, data)
  }
  return pb.collection('scgs').create<SCG>({ ...data, user_id: pb.authStore.record.id })
}

export const deleteSCG = async (id: string) => {
  return pb.collection('scgs').delete(id)
}

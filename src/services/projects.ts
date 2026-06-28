import pb from '@/lib/pocketbase/client'

export interface Project {
  id?: string
  user_id?: string
  title: string
  area: 'Marketing' | 'Vendas' | 'Produto' | 'Operações' | 'Pessoas' | 'Capital'
  pgg_json?: any
  pmv_json?: any
  is_domino?: boolean
  status?: 'planned' | 'in_progress' | 'completed'
}

export const getProjects = async () => {
  try {
    return await pb.collection('projects').getFullList<Project>({ sort: '-created' })
  } catch {
    return []
  }
}

export const saveProject = async (data: Partial<Project>) => {
  if (!pb.authStore.record?.id) throw new Error('Not logged in')

  if (data.id) {
    return pb.collection('projects').update<Project>(data.id, data)
  }
  return pb.collection('projects').create<Project>({ ...data, user_id: pb.authStore.record.id })
}

export const deleteProject = async (id: string) => {
  return pb.collection('projects').delete(id)
}

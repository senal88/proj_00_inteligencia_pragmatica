import pb from '@/lib/pocketbase/client'

export interface DirectionStructured {
  id?: string
  company_id: string
  mission_statement?: string
  transformation?: string
  target_customer?: string
  behaviors?: string
  medal_scene_type?: 'Capital' | 'Liberdade' | 'Reconhecimento' | ''
  medal_scene_description?: string
  ideal_monday?: string
  what_stops_doing?: string
  team_size?: number
  expected_revenue?: number
  expected_profit?: number
  annual_revenue?: number
  annual_profit?: number
  user_id?: string
}

export const getDirection = async (companyId: string) => {
  return getDirectionStructured(companyId)
}

export const getDirectionStructured = async (companyId: string) => {
  try {
    const records = await pb.collection('directions_structured').getFullList<DirectionStructured>({
      filter: `company_id = "${companyId}"`,
      limit: 1,
    })
    return records[0] || null
  } catch {
    return null
  }
}

export const saveDirectionStructured = async (data: Partial<DirectionStructured>) => {
  if (!data.company_id) throw new Error('Company ID is required')
  const existing = await getDirectionStructured(data.company_id)
  if (existing?.id) {
    return pb.collection('directions_structured').update<DirectionStructured>(existing.id, data)
  }
  if (!pb.authStore.record?.id) throw new Error('Not logged in')
  return pb.collection('directions_structured').create<DirectionStructured>({
    ...data,
    user_id: pb.authStore.record.id,
  })
}

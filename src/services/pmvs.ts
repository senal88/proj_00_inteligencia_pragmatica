import pb from '@/lib/pocketbase/client'

export interface PMV {
  id?: string
  user_id?: string
  pgg_id: string
  r1_result?: string
  r2_reason?: string
  r3_reference?: string
  r4_direction?: string
  r5_resources?: string
  r6_restrictions?: string
  r7_risks?: string
  r8_responsible?: string
}

export const getPMVs = async () => {
  try {
    return await pb.collection('pmvs').getFullList<PMV>()
  } catch {
    return []
  }
}

export const getPMVByPGG = async (pggId: string) => {
  try {
    const records = await pb.collection('pmvs').getFullList<PMV>({
      filter: `pgg_id = "${pggId}"`,
      limit: 1,
    })
    return records[0] || null
  } catch {
    return null
  }
}

export const savePMV = async (data: Partial<PMV>) => {
  if (!pb.authStore.record?.id) throw new Error('Not logged in')

  if (data.id) {
    return pb.collection('pmvs').update<PMV>(data.id, data)
  }
  return pb.collection('pmvs').create<PMV>({ ...data, user_id: pb.authStore.record.id })
}

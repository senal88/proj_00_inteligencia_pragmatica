import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { getPGGs, savePGG, deletePGG, type PGG } from '@/services/pggs'
import { getPMVs, savePMV, type PMV } from '@/services/pmvs'
import { getDefaultQuarterAndCompany } from '@/lib/defaults'
import { useRealtime } from '@/hooks/use-realtime'
import { toast } from 'sonner'
import { Crown, Layers, Plus, Trash2 } from 'lucide-react'

const AREAS = ['Marketing', 'Vendas', 'Produto', 'Operações'] as const
const COMMITMENTS = ['Social', 'Financeiro', 'Ambiente'] as const

const PMV_FIELDS = [
  { key: 'r1_result', label: 'R1 - Resultado' },
  { key: 'r2_reason', label: 'R2 - Razão' },
  { key: 'r3_reference', label: 'R3 - Referência' },
  { key: 'r4_direction', label: 'R4 - Rumo' },
  { key: 'r5_resources', label: 'R5 - Recursos' },
  { key: 'r6_restrictions', label: 'R6 - Restrições' },
  { key: 'r7_risks', label: 'R7 - Riscos' },
  { key: 'r8_responsible', label: 'R8 - Responsável' },
] as const

export default function Projetos() {
  const [pggs, setPggs] = useState<PGG[]>([])
  const [pmvs, setPmvs] = useState<Record<string, PMV>>({})
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingPgg, setEditingPgg] = useState<Partial<PGG>>({
    area: 'Marketing',
    is_domino: false,
    status: 'Não iniciado',
    commitment_type: 'Financeiro',
  })
  const [editingPmv, setEditingPmv] = useState<Partial<PMV>>({})

  const load = async () => {
    try {
      const pList = await getPGGs()
      setPggs(pList)
      const pmvMap: Record<string, PMV> = {}
      for (const p of pList) {
        if (p.is_domino && p.id) {
          const pmvList = await getPMVs(p.id)
          if (pmvList.length > 0) pmvMap[p.id] = pmvList[0]
        }
      }
      setPmvs(pmvMap)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useRealtime('pggs', () => {
    load()
  })

  const handleSave = async () => {
    if (!editingPgg.area) return toast.error('A área é obrigatória')
    if (!editingPgg.controllable_action) return toast.error('A ação controlável é obrigatória')

    try {
      const { quarterId } = await getDefaultQuarterAndCompany()
      const pggData = { ...editingPgg, quarter_id: quarterId }
      if (!pggData.status) pggData.status = 'Não iniciado'

      const savedPgg = await savePGG(pggData)

      if (savedPgg.is_domino) {
        await savePMV({ ...editingPmv, pgg_id: savedPgg.id! })
      }

      toast.success('PGG salvo com sucesso')
      setOpen(false)
      load()
    } catch {
      toast.error('Erro ao salvar PGG')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este projeto?')) return
    try {
      await deletePGG(id)
      toast.success('Excluído com sucesso')
      load()
    } catch {
      toast.error('Erro ao excluir')
    }
  }

  const handleSetDomino = async (p: PGG) => {
    try {
      await savePGG({ ...p, is_domino: true })
      toast.success('Definido como PGG-Dominó!')
      load()
    } catch {
      toast.error('Erro ao definir dominó')
    }
  }

  const handleEdit = (p: PGG) => {
    setEditingPgg(p)
    if (p.is_domino && p.id && pmvs[p.id]) {
      setEditingPmv(pmvs[p.id])
    } else {
      setEditingPmv({})
    }
    setOpen(true)
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="ds-dash-title text-white">Projetos Ganha-Ganha</h1>
          <p className="text-muted-foreground mt-1">
            Gestão estratégica com a clareza dos 4Cs e PMV.
          </p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o)
            if (!o) {
              setEditingPgg({
                area: 'Marketing',
                is_domino: false,
                status: 'Não iniciado',
                commitment_type: 'Financeiro',
              })
              setEditingPmv({})
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Novo PGG
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-black/90 border-white/10">
            <DialogHeader>
              <DialogTitle className="ds-page-title">
                {editingPgg.id ? 'Editar PGG' : 'Novo PGG'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Área Funcional</Label>
                  <Select
                    value={editingPgg.area}
                    onValueChange={(v) => setEditingPgg({ ...editingPgg, area: v as any })}
                  >
                    <SelectTrigger className="bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AREAS.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editingPgg.status}
                    onValueChange={(v) => setEditingPgg({ ...editingPgg, status: v as any })}
                  >
                    <SelectTrigger className="bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['Não iniciado', 'Em andamento', 'Concluído', 'Cancelado'].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 p-4 border border-blue-500/20 rounded-lg bg-blue-500/5">
                <h3 className="ds-section-title text-blue-400">Os 4 Cs do PGG</h3>
                <p className="text-sm italic text-muted-foreground">
                  "Vou [Ação Controlável] para alcançar [Resultado Corajoso] até [Prazo],
                  comprometido com [Compromisso]"
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ação Controlável</Label>
                    <Input
                      value={editingPgg.controllable_action || ''}
                      onChange={(e) =>
                        setEditingPgg({ ...editingPgg, controllable_action: e.target.value })
                      }
                      className="bg-white/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Resultado Corajoso</Label>
                    <Input
                      value={editingPgg.courageous_result || ''}
                      onChange={(e) =>
                        setEditingPgg({ ...editingPgg, courageous_result: e.target.value })
                      }
                      className="bg-white/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prazo (Conciso)</Label>
                    <Input
                      type="date"
                      value={editingPgg.deadline ? editingPgg.deadline.split('T')[0] : ''}
                      onChange={(e) => setEditingPgg({ ...editingPgg, deadline: e.target.value })}
                      className="bg-white/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Compromisso</Label>
                    <Select
                      value={editingPgg.commitment_type}
                      onValueChange={(v) =>
                        setEditingPgg({ ...editingPgg, commitment_type: v as any })
                      }
                    >
                      <SelectTrigger className="bg-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMITMENTS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Descrição do Compromisso</Label>
                    <Input
                      value={editingPgg.commitment_description || ''}
                      onChange={(e) =>
                        setEditingPgg({ ...editingPgg, commitment_description: e.target.value })
                      }
                      className="bg-white/5"
                    />
                  </div>
                </div>
              </div>

              {editingPgg.is_domino && (
                <div className="space-y-4 p-4 border border-white/10 rounded-lg bg-white/5">
                  <h3 className="ds-section-title">PMV (Plano Mínimo Viável - 8Rs)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {PMV_FIELDS.map((r) => (
                      <div className="space-y-2" key={r.key}>
                        <Label>{r.label}</Label>
                        <Input
                          value={(editingPmv as any)?.[r.key] || ''}
                          onChange={(e) =>
                            setEditingPmv({ ...editingPmv, [r.key]: e.target.value })
                          }
                          className="bg-white/5"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={handleSave} className="w-full">
                Salvar PGG
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pggs.map((p) => (
          <Card
            key={p.id}
            className={`bg-black/40 border-white/10 backdrop-blur-sm transition-all hover:bg-black/60 relative ${p.is_domino ? 'ring-2 ring-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : ''}`}
          >
            {p.is_domino && (
              <div className="absolute -top-3 -right-3 bg-amber-500 text-black p-2 rounded-full shadow-lg">
                <Crown className="w-5 h-5" />
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                  {p.area}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-xs">
                  {p.status}
                </Badge>
              </div>
              <CardTitle className="ds-section-title line-clamp-2">
                {p.controllable_action || '(Sem ação definida)'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-1">
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold min-w-4">O:</span>{' '}
                  <span className="text-white/80 truncate">{p.courageous_result || '-'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-400 font-bold min-w-4">T:</span>{' '}
                  <span className="text-white/80 truncate">
                    {p.deadline ? new Date(p.deadline).toLocaleDateString() : '-'}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between border-t border-white/5 mt-4 pt-4">
              <div className="space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(p)}>
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => p.id && handleDelete(p.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {!p.is_domino && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                  onClick={() => handleSetDomino(p)}
                >
                  Set Dominó
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
        {pggs.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-white/10 rounded-lg bg-white/5">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum PGG cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}

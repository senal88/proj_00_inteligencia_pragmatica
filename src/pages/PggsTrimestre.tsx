import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { getDefaultCompany, type Company } from '@/services/companies'
import { getQuarters, createQuarter, type Quarter } from '@/services/quarters'
import { getPGGs, savePGG, type PGG } from '@/services/pggs'
import { toast } from 'sonner'
import { Save, Plus, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const AREAS: PGG['area'][] = ['Marketing', 'Vendas', 'Produto', 'Operações']

export default function PggsTrimestre() {
  const [company, setCompany] = useState<Company | null>(null)
  const [quarters, setQuarters] = useState<Quarter[]>([])
  const [selectedQuarterId, setSelectedQuarterId] = useState<string>('')
  const [pggs, setPggs] = useState<Record<string, Partial<PGG>>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newQuarterOpen, setNewQuarterOpen] = useState(false)
  const [nqYear, setNqYear] = useState<string>(new Date().getFullYear().toString())
  const [nqQ, setNqQ] = useState<'T1' | 'T2' | 'T3' | 'T4'>('T1')

  const loadData = async () => {
    try {
      const comp = await getDefaultCompany()
      setCompany(comp)
      const qList = await getQuarters(comp.id)
      setQuarters(qList)
      if (qList.length > 0) {
        if (!selectedQuarterId || !qList.find((q) => q.id === selectedQuarterId)) {
          setSelectedQuarterId(qList[0].id)
        }
      } else {
        setLoading(false)
      }
    } catch {
      toast.error('Erro ao carregar dados.')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedQuarterId) {
      loadPGGs(selectedQuarterId)
    }
  }, [selectedQuarterId])

  const loadPGGs = async (qId: string) => {
    setLoading(true)
    try {
      const list = await getPGGs(qId)
      const pggMap: Record<string, Partial<PGG>> = {}
      AREAS.forEach((area) => {
        const existing = list.find((p) => p.area === area)
        pggMap[area] = existing || {
          quarter_id: qId,
          area,
          is_domino: false,
          status: 'Não iniciado',
        }
      })
      setPggs(pggMap)
    } catch {
      toast.error('Erro ao carregar PGGs.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateQuarter = async () => {
    if (!company) return
    try {
      const q = await createQuarter({
        company_id: company.id,
        year: parseInt(nqYear),
        quarter_number: nqQ,
      })
      toast.success('Trimestre criado!')
      setNewQuarterOpen(false)
      await loadData()
      setSelectedQuarterId(q.id)
    } catch {
      toast.error('Erro ao criar trimestre.')
    }
  }

  const handleChange = (area: string, field: keyof PGG, value: any) => {
    setPggs((prev) => {
      const newMap = { ...prev, [area]: { ...prev[area], [field]: value } }
      if (field === 'is_domino' && value === true) {
        Object.keys(newMap).forEach((k) => {
          if (k !== area) newMap[k].is_domino = false
        })
      }
      return newMap
    })
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const promises = Object.values(pggs).map((pgg) => savePGG(pgg))
      await Promise.all(promises)
      toast.success('PGGs salvos com sucesso!')
      if (selectedQuarterId) loadPGGs(selectedQuarterId)
    } catch {
      toast.error('Erro ao salvar PGGs.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSingle = async (area: string) => {
    setSaving(true)
    try {
      const pgg = pggs[area]
      if (pgg) {
        if (pgg.is_domino) {
          const promises = Object.values(pggs).map((p) => savePGG(p))
          await Promise.all(promises)
          if (selectedQuarterId) await loadPGGs(selectedQuarterId)
          toast.success(`PGG Dominó definido para ${area} e salvo!`)
        } else {
          const saved = await savePGG(pgg)
          setPggs((prev) => ({ ...prev, [area]: { ...prev[area], ...saved } }))
          toast.success(`PGG de ${area} salvo com sucesso!`)
        }
      }
    } catch {
      toast.error(`Erro ao salvar PGG de ${area}.`)
    } finally {
      setSaving(false)
    }
  }

  if (loading && quarters.length === 0)
    return <div className="p-8 text-center text-content">Carregando...</div>

  return (
    <div className="space-y-8 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="ds-dash-title text-content">PGGs do Trimestre</h1>
          <p className="text-content-muted mt-1">
            Defina as táticas trimestrais e escolha o Dominó.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          {quarters.length > 0 && (
            <Select value={selectedQuarterId} onValueChange={setSelectedQuarterId}>
              <SelectTrigger className="w-full sm:w-[180px] ds-input h-[38px]">
                <SelectValue placeholder="Selecione o Trimestre" />
              </SelectTrigger>
              <SelectContent className="bg-surface-2 border-border text-content">
                {quarters.map((q) => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.year} - {q.quarter_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Dialog open={newQuarterOpen} onOpenChange={setNewQuarterOpen}>
              <DialogTrigger asChild>
                <button className="ghost-btn border border-border flex-1 sm:flex-none justify-center whitespace-nowrap px-3 sm:px-4">
                  <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
                  <span className="hidden min-[380px]:inline ml-1.5 sm:ml-2">Novo Trimestre</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-surface-1 border-border text-content">
                <DialogHeader>
                  <DialogTitle className="ds-page-title">Criar Novo Trimestre</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-content text-sm">Ano</Label>
                    <Input
                      type="number"
                      value={nqYear}
                      onChange={(e) => setNqYear(e.target.value)}
                      className="ds-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-content text-sm">Trimestre</Label>
                    <Select value={nqQ} onValueChange={(v: any) => setNqQ(v)}>
                      <SelectTrigger className="ds-input h-[38px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-surface-2 border-border text-content">
                        <SelectItem value="T1">T1 (Jan-Mar)</SelectItem>
                        <SelectItem value="T2">T2 (Abr-Jun)</SelectItem>
                        <SelectItem value="T3">T3 (Jul-Set)</SelectItem>
                        <SelectItem value="T4">T4 (Out-Dez)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="ghost-btn">Cancelar</button>
                  </DialogClose>
                  <button className="primary-btn" onClick={handleCreateQuarter}>
                    Criar
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {quarters.length > 0 && (
              <button
                className="primary-btn flex-1 sm:flex-none justify-center whitespace-nowrap px-3 sm:px-4"
                onClick={handleSaveAll}
                disabled={saving || loading}
              >
                <Save className="w-5 h-5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span>{saving ? 'Salvando...' : 'Salvar Todos'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {quarters.length === 0 ? (
        <div className="text-center p-12 bg-surface-2 rounded-lg border border-border">
          <p className="text-content mb-4">Nenhum trimestre criado ainda.</p>
          <button className="primary-btn" onClick={() => setNewQuarterOpen(true)}>
            Criar Primeiro Trimestre
          </button>
        </div>
      ) : (
        <Accordion type="multiple" className="w-full space-y-4">
          {AREAS.map((area) => {
            const pgg = pggs[area] || {}
            const isDomino = pgg.is_domino
            return (
              <AccordionItem
                value={area}
                key={area}
                className={`ds-card flex flex-col p-0 transition-all duration-300 border-b-0 overflow-hidden ${isDomino ? 'border-brand shadow-[0_0_15px_rgba(var(--accent),0.3)] bg-surface-2' : 'border-border bg-surface-1'}`}
              >
                <AccordionTrigger
                  className={`px-6 py-5 hover:no-underline [&[data-state=open]]:border-b ${isDomino ? 'border-brand/20 bg-brand/5' : 'border-border'}`}
                >
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <span className="ds-page-title text-content m-0">{area}</span>
                    {isDomino && <span className="new-tag font-sans not-italic">PGG Dominó</span>}
                    {pgg.status === 'Concluído' && (
                      <CheckCircle2 className="w-6 h-6 text-green-500 ml-auto mr-4" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 sm:p-8 space-y-8 bg-surface-1">
                  <div className="flex items-center space-x-4 bg-surface-2 p-4 rounded-lg border border-border">
                    <Switch
                      id={`domino-${area}`}
                      checked={isDomino || false}
                      onCheckedChange={(v) => handleChange(area, 'is_domino', v)}
                    />
                    <Label
                      htmlFor={`domino-${area}`}
                      className="text-content text-sm font-medium cursor-pointer select-none"
                    >
                      É o PGG Dominó?
                    </Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2.5">
                      <Label className="text-content-muted text-[11px] font-bold uppercase tracking-wider">
                        Status
                      </Label>
                      <Select
                        value={pgg.status || 'Não iniciado'}
                        onValueChange={(v) => handleChange(area, 'status', v)}
                      >
                        <SelectTrigger className="ds-input h-[42px] text-sm bg-bg-1 border-border/60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-surface-2 border-border text-content">
                          <SelectItem value="Não iniciado">Não iniciado</SelectItem>
                          <SelectItem value="Em andamento">Em andamento</SelectItem>
                          <SelectItem value="Concluído">Concluído</SelectItem>
                          <SelectItem value="Cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-content-muted text-[11px] font-bold uppercase tracking-wider">
                        Prazo
                      </Label>
                      <Input
                        type="date"
                        className="ds-input h-[42px] text-sm bg-bg-1 border-border/60"
                        value={pgg.deadline ? pgg.deadline.split('T')[0] : ''}
                        onChange={(e) => handleChange(area, 'deadline', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-content-muted text-[11px] font-bold uppercase tracking-wider">
                        Ação controlável
                      </Label>
                      <Input
                        className="ds-input h-[42px] text-sm bg-bg-1 border-border/60"
                        value={pgg.controllable_action || ''}
                        onChange={(e) => handleChange(area, 'controllable_action', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2.5">
                      <Label className="text-content-muted text-[11px] font-bold uppercase tracking-wider">
                        Resultado corajoso
                      </Label>
                      <Input
                        className="ds-input h-[42px] text-sm bg-bg-1 border-border/60"
                        value={pgg.courageous_result || ''}
                        onChange={(e) => handleChange(area, 'courageous_result', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-content-muted text-[11px] font-bold uppercase tracking-wider">
                        Tipo de compromisso
                      </Label>
                      <Select
                        value={pgg.commitment_type || ''}
                        onValueChange={(v) => handleChange(area, 'commitment_type', v)}
                      >
                        <SelectTrigger className="ds-input h-[42px] text-sm bg-bg-1 border-border/60">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-surface-2 border-border text-content">
                          <SelectItem value="Social">Social</SelectItem>
                          <SelectItem value="Financeiro">Financeiro</SelectItem>
                          <SelectItem value="Ambiente">Ambiente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2.5">
                      <Label className="text-content-muted text-[11px] font-bold uppercase tracking-wider">
                        Descrição do compromisso
                      </Label>
                      <Input
                        className="ds-input h-[42px] text-sm bg-bg-1 border-border/60"
                        value={pgg.commitment_description || ''}
                        onChange={(e) =>
                          handleChange(area, 'commitment_description', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-content-muted text-[11px] font-bold uppercase tracking-wider">
                      PGG completo — frase montada
                    </Label>
                    <Textarea
                      className="ds-input text-sm min-h-[100px] bg-bg-1 border-border/60"
                      value={pgg.full_phrase || ''}
                      onChange={(e) => handleChange(area, 'full_phrase', e.target.value)}
                    />
                  </div>

                  <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <button
                      className="ghost-btn border border-border/60 hover:bg-surface-3 transition-colors px-4 py-2"
                      onClick={() => handleSaveSingle(area)}
                      disabled={saving}
                    >
                      <Save className="w-4 h-4 mr-2" /> Salvar {area}
                    </button>

                    <div className="flex justify-end w-full sm:w-auto">
                      {isDomino &&
                        (pgg.id ? (
                          <Link to={`/pmv/${pgg.id}`} className="primary-btn px-5 py-2">
                            Ver PMV do Dominó <ArrowRight className="w-4 h-4 ml-1.5" />
                          </Link>
                        ) : (
                          <p className="text-sm text-content-muted self-center">
                            Salve para liberar o PMV.
                          </p>
                        ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      )}
    </div>
  )
}

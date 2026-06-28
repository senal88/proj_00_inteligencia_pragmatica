import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { getSCGs, saveSCG, deleteSCG, type SCG } from '@/services/scgs'
import { getDefaultQuarterAndCompany } from '@/lib/defaults'
import { useRealtime } from '@/hooks/use-realtime'
import { toast } from 'sonner'
import { AlertCircle, Plus, Trash2, ArrowRight } from 'lucide-react'

const AREAS = ['Marketing', 'Vendas', 'Produto', 'Operações', 'Pessoas', 'Capital'] as const
const STATUSES = [
  'Diagnóstico em andamento',
  'Gargalo identificado',
  'Solução em execução',
  'Resolvido',
] as const

export default function Problemas() {
  const [scgs, setScgs] = useState<SCG[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [editing, setEditing] = useState<Partial<SCG>>({
    bottleneck_area: 'Operações',
    status: 'Diagnóstico em andamento',
  })

  const load = () => {
    getSCGs().then((res) => {
      setScgs(res)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  useRealtime('scgs', () => {
    load()
  })

  const handleSave = async () => {
    if (!editing.symptom_description || !editing.bottleneck_area)
      return toast.error('Sintoma e área são obrigatórios')
    try {
      const { companyId } = await getDefaultQuarterAndCompany()
      const scgData = { ...editing, company_id: companyId }
      if (!scgData.status) scgData.status = 'Diagnóstico em andamento'

      await saveSCG(scgData)
      toast.success('Diagnóstico SCG documentado')
      setOpen(false)
      load()
    } catch {
      toast.error('Erro ao salvar SCG')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este SCG?')) return
    try {
      await deleteSCG(id)
      toast.success('Excluído')
      load()
    } catch {
      toast.error('Erro ao excluir')
    }
  }

  const handleEdit = (p: SCG) => {
    setEditing(p)
    setStep(1)
    setOpen(true)
  }

  const openNew = () => {
    setEditing({ bottleneck_area: 'Operações', status: 'Diagnóstico em andamento' })
    setStep(1)
    setOpen(true)
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="ds-dash-title text-white">Framework SCG</h1>
          <p className="text-muted-foreground mt-1">
            Sistema de Causa e Gargalo para destravar gargalos.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={openNew}>
            <Plus className="w-4 h-4 mr-2" /> Diagnosticar Problema
          </Button>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black/90 border-white/10">
            <DialogHeader>
              <DialogTitle className="ds-page-title text-white">
                {step === 1 && '1. Identificação'}
                {step === 2 && '2. Sintoma'}
                {step === 3 && '3. Causa (5 Porquês)'}
                {step === 4 && '4. Gargalo e Solução'}
              </DialogTitle>
            </DialogHeader>

            <div className="py-4 space-y-6">
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label>Qual área aparenta ser a dona do problema?</Label>
                    <Select
                      value={editing.bottleneck_area}
                      onValueChange={(v) => setEditing({ ...editing, bottleneck_area: v as any })}
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
                    <Label>Status do Diagnóstico</Label>
                    <Select
                      value={editing.status}
                      onValueChange={(v) => setEditing({ ...editing, status: v as any })}
                    >
                      <SelectTrigger className="bg-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data do Diagnóstico</Label>
                    <Input
                      type="date"
                      value={editing.diagnosis_date ? editing.diagnosis_date.split('T')[0] : ''}
                      onChange={(e) => setEditing({ ...editing, diagnosis_date: e.target.value })}
                      className="bg-white/5"
                    />
                  </div>
                  <Button className="w-full mt-4" onClick={() => setStep(2)}>
                    Próximo <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-4">
                    <h3 className="ds-section-title text-white">S - Sintoma</h3>

                    <div className="space-y-2">
                      <Label>O quê dói?</Label>
                      <Textarea
                        value={editing.symptom_description || ''}
                        onChange={(e) =>
                          setEditing({ ...editing, symptom_description: e.target.value })
                        }
                        className="bg-black/50"
                        placeholder="Ex: Vendas estagnadas"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quanto?</Label>
                        <Input
                          value={editing.symptom_magnitude || ''}
                          onChange={(e) =>
                            setEditing({ ...editing, symptom_magnitude: e.target.value })
                          }
                          className="bg-black/50"
                          placeholder="Ex: Queda de 30%"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Desde quando?</Label>
                        <Input
                          value={editing.symptom_duration || ''}
                          onChange={(e) =>
                            setEditing({ ...editing, symptom_duration: e.target.value })
                          }
                          className="bg-black/50"
                          placeholder="Ex: Últimos 60 dias"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Voltar
                    </Button>
                    <Button className="flex-1" onClick={() => setStep(3)}>
                      Próximo <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                    <h3 className="ds-section-title text-white mb-2">C - Causa</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Pergunte "por quê" pelo menos 3 vezes. Force o pensamento até a raiz.
                    </p>
                    <Textarea
                      value={editing.causes_identified || ''}
                      onChange={(e) =>
                        setEditing({ ...editing, causes_identified: e.target.value })
                      }
                      className="bg-black/50 min-h-[150px]"
                      placeholder="Por que as vendas caíram? Porque leads diminuíram. Por quê? Porque as campanhas..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Voltar
                    </Button>
                    <Button className="flex-1" onClick={() => setStep(4)}>
                      Próximo <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h3 className="ds-section-title text-red-400 mb-2">G - Gargalo</h3>
                    <p className="text-sm text-red-400/70 mb-4">
                      "Qual causa, se eu matar, mata o sintoma?"
                    </p>
                    <Input
                      value={editing.bottleneck_identified || ''}
                      onChange={(e) =>
                        setEditing({ ...editing, bottleneck_identified: e.target.value })
                      }
                      className="bg-black/50"
                    />
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg space-y-4">
                    <h3 className="ds-section-title text-green-400 mb-2">S - Solução</h3>
                    <div className="space-y-2">
                      <Label className="text-green-400/70">Solução Escolhida</Label>
                      <Textarea
                        value={editing.chosen_solution || ''}
                        onChange={(e) =>
                          setEditing({ ...editing, chosen_solution: e.target.value })
                        }
                        className="bg-black/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-green-400/70">Métrica de Validação</Label>
                      <Input
                        value={editing.validation_metric || ''}
                        onChange={(e) =>
                          setEditing({ ...editing, validation_metric: e.target.value })
                        }
                        className="bg-black/50"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setStep(3)}>
                      Voltar
                    </Button>
                    <Button className="flex-1" onClick={handleSave}>
                      Finalizar SCG
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {scgs.map((p) => (
          <Card key={p.id} className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-white/5">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-white/70 border-white/20">
                  {p.bottleneck_area}
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-xs">
                  {p.status}
                </Badge>
              </div>
              <CardTitle className="ds-section-title text-white">
                {p.symptom_description || '(Sem título)'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-bold w-4">S:</span>{' '}
                  <span className="text-white/80 line-clamp-1">{p.symptom_magnitude || '-'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-400 font-bold w-4">G:</span>{' '}
                  <span className="text-white/80 line-clamp-1">
                    {p.bottleneck_identified || '-'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-400 font-bold w-4">S:</span>{' '}
                  <span className="text-white/80 line-clamp-1">{p.chosen_solution || '-'}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-end">
              <div className="space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(p)}>
                  Ver Detalhes
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
            </CardFooter>
          </Card>
        ))}
        {scgs.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-white/10 rounded-lg bg-white/5">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum problema diagnosticado no momento.</p>
          </div>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { getPMVByPGG, savePMV, type PMV } from '@/services/pmvs'
import { toast } from 'sonner'
import { Save, ArrowLeft } from 'lucide-react'

export default function PmvDomino() {
  const { pggId } = useParams<{ pggId: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<Partial<PMV>>({ pgg_id: pggId })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pggId) {
      navigate('/pggs')
      return
    }
    const load = async () => {
      try {
        const existing = await getPMVByPGG(pggId)
        if (existing) setData(existing)
      } catch {
        toast.error('Erro ao carregar PMV.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [pggId, navigate])

  const handleChange = (field: keyof PMV, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await savePMV(data)
      toast.success('PMV salvo com sucesso!')
    } catch {
      toast.error('Erro ao salvar PMV.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-white">Carregando...</div>

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button
            variant="ghost"
            asChild
            className="mb-2 -ml-4 text-muted-foreground hover:text-white"
          >
            <Link to="/pggs">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar aos PGGs
            </Link>
          </Button>
          <h1 className="ds-dash-title text-white">PMV do Dominó</h1>
          <p className="text-muted-foreground mt-1">Planejamento detalhado com a metodologia 8R.</p>
        </div>
        <Button type="submit" disabled={saving}>
          <Save className="w-4 h-4 mr-2" /> {saving ? 'Salvando...' : 'Salvar PMV'}
        </Button>
      </div>

      <Card className="bg-black/50 border-white/10">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="ds-page-title text-primary">Os 8 Rs do Projeto</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          <div className="space-y-3">
            <div>
              <Label className="text-white ds-section-title !text-lg">R1 Resultado</Label>
              <p className="text-sm text-muted-foreground">O que quer alcançar?</p>
            </div>
            <Textarea
              className="bg-white/5 text-white min-h-[80px]"
              value={data.r1_result || ''}
              onChange={(e) => handleChange('r1_result', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-white ds-section-title !text-lg">R2 Razão</Label>
              <p className="text-sm text-muted-foreground">
                Por que este projeto é o mais importante?
              </p>
            </div>
            <Textarea
              className="bg-white/5 text-white min-h-[80px]"
              value={data.r2_reason || ''}
              onChange={(e) => handleChange('r2_reason', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-white ds-section-title !text-lg">R3 Referência</Label>
              <p className="text-sm text-muted-foreground">
                Quem já fez algo parecido e o que aprendemos?
              </p>
            </div>
            <Textarea
              className="bg-white/5 text-white min-h-[80px]"
              value={data.r3_reference || ''}
              onChange={(e) => handleChange('r3_reference', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-white ds-section-title !text-lg">R4 Rumo</Label>
              <p className="text-sm text-muted-foreground">Quais são os marcos para chegar lá?</p>
            </div>
            <Textarea
              className="bg-white/5 text-white min-h-[80px]"
              value={data.r4_direction || ''}
              onChange={(e) => handleChange('r4_direction', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-white ds-section-title !text-lg">R5 Recursos</Label>
              <p className="text-sm text-muted-foreground">
                Quais dinheiro, pessoas e informações são necessários?
              </p>
            </div>
            <Textarea
              className="bg-white/5 text-white min-h-[80px]"
              value={data.r5_resources || ''}
              onChange={(e) => handleChange('r5_resources', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-white ds-section-title !text-lg">R6 Restrições</Label>
              <p className="text-sm text-muted-foreground">
                O que não abre mão ou tornaria o sucesso um fracasso?
              </p>
            </div>
            <Textarea
              className="bg-white/5 text-white min-h-[80px]"
              value={data.r6_restrictions || ''}
              onChange={(e) => handleChange('r6_restrictions', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-white ds-section-title !text-lg">R7 Riscos</Label>
              <p className="text-sm text-muted-foreground">
                Pré-mortem: o que pode dar errado e a mitigação?
              </p>
            </div>
            <Textarea
              className="bg-white/5 text-white min-h-[80px]"
              value={data.r7_risks || ''}
              onChange={(e) => handleChange('r7_risks', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-white ds-section-title !text-lg">R8 Responsável</Label>
              <p className="text-sm text-muted-foreground">Quem é o único responsável (nome)?</p>
            </div>
            <Input
              className="bg-white/5 text-white"
              value={data.r8_responsible || ''}
              onChange={(e) => handleChange('r8_responsible', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={saving}>
          <Save className="w-5 h-5 mr-2" /> {saving ? 'Salvando...' : 'Salvar PMV'}
        </Button>
      </div>
    </form>
  )
}

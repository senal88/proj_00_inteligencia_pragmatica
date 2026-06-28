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
import {
  getDirectionStructured,
  saveDirectionStructured,
  type DirectionStructured,
} from '@/services/directions'
import { getDefaultCompany, type Company } from '@/services/companies'
import { toast } from 'sonner'
import { Save, BookOpen } from 'lucide-react'

export default function Direcao() {
  const [company, setCompany] = useState<Company | null>(null)
  const [data, setData] = useState<Partial<DirectionStructured>>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const comp = await getDefaultCompany()
        setCompany(comp)
        const dir = await getDirectionStructured(comp.id)
        if (dir) setData(dir)
        else setData({ company_id: comp.id })
      } catch (err) {
        toast.error('Erro ao carregar empresa e direção.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleChange = (field: keyof DirectionStructured, value: string | number) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!company) return

    if (!data.transformation || !data.target_customer) {
      toast.error('Preencha os campos obrigatórios (Transformação, Cliente-alvo).')
      return
    }

    setSaving(true)
    try {
      await saveDirectionStructured({ ...data, company_id: company.id })
      toast.success('Direção salva com sucesso!')
    } catch {
      toast.error('Erro ao salvar direção.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-content-muted">
        <BookOpen className="w-12 h-12 animate-pulse text-primary mb-4" />
        <p>Carregando Direção...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="ds-dash-title text-content">Direção IP26</h1>
          <p className="text-content-muted mt-1">
            Onde sua empresa está indo, e por que ela existe.
          </p>
        </div>
        <button type="submit" disabled={saving} className="primary-btn">
          <Save className="w-4 h-4 mr-2" /> {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <div className="grid gap-12">
        {/* Missão */}
        <div className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-2xl font-bold text-content flex items-baseline gap-2 italic">
              Missão
              <small className="text-content-muted text-sm font-sans not-italic font-normal">
                5 a 10 anos
              </small>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/40 border border-border p-6 rounded-xl space-y-3">
              <Label className="text-content text-lg font-semibold italic block">
                Transformação *
              </Label>
              <Input
                required
                className="ds-input bg-surface-0"
                value={data.transformation || ''}
                onChange={(e) => handleChange('transformation', e.target.value)}
                placeholder="Ex: Multiplicar o lucro..."
              />
            </div>
            <div className="bg-muted/40 border border-border p-6 rounded-xl space-y-3">
              <Label className="text-content text-lg font-semibold italic block">
                Cliente-alvo *
              </Label>
              <Input
                required
                className="ds-input bg-surface-0"
                value={data.target_customer || ''}
                onChange={(e) => handleChange('target_customer', e.target.value)}
                placeholder="Ex: Donos de PMEs..."
              />
            </div>
            <div className="bg-muted/40 border border-border p-6 rounded-xl space-y-3 md:col-span-2">
              <Label className="text-content text-lg font-semibold italic block">
                Comportamentos
              </Label>
              <Textarea
                className="ds-input min-h-[80px] bg-surface-0"
                value={data.behaviors || ''}
                onChange={(e) => handleChange('behaviors', e.target.value)}
                placeholder="Ex: Obsessão, Energia..."
              />
            </div>
            <div className="bg-muted/40 border border-border p-6 rounded-xl space-y-3 md:col-span-2">
              <Label className="text-content text-lg font-semibold italic block">
                Missão — frase completa
              </Label>
              <Textarea
                className="ds-input min-h-[80px] bg-surface-0"
                value={data.mission_statement || ''}
                onChange={(e) => handleChange('mission_statement', e.target.value)}
                placeholder="Entregamos [Transformação] para [Cliente-alvo]..."
              />
            </div>
          </div>
        </div>

        {/* Medalha */}
        <div className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-2xl font-bold text-content flex items-baseline gap-2 italic">
              Medalha
              <small className="text-content-muted text-sm font-sans not-italic font-normal">
                2 a 4 anos
              </small>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/40 border border-border p-6 rounded-xl space-y-3">
              <Label className="text-content text-lg font-semibold italic block">Cena</Label>
              <Select
                value={data.medal_scene_type || ''}
                onValueChange={(val) => handleChange('medal_scene_type', val)}
              >
                <SelectTrigger className="ds-input h-[38px] bg-surface-0">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-surface-2 border-border text-content">
                  <SelectItem value="Capital">Capital</SelectItem>
                  <SelectItem value="Liberdade">Liberdade</SelectItem>
                  <SelectItem value="Reconhecimento">Reconhecimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-muted/40 border border-border p-6 rounded-xl space-y-3">
              <Label className="text-content text-lg font-semibold italic block">
                Descrição da cena
              </Label>
              <Textarea
                className="ds-input min-h-[80px] bg-surface-0"
                value={data.medal_scene_description || ''}
                onChange={(e) => handleChange('medal_scene_description', e.target.value)}
                placeholder="O que dizem de mim e da empresa..."
              />
            </div>
            <div className="bg-muted/40 border border-border p-6 rounded-xl space-y-3 md:col-span-2">
              <Label className="text-content text-lg font-semibold italic block">
                Segunda-feira ideal
              </Label>
              <Textarea
                className="ds-input min-h-[80px] bg-surface-0"
                value={data.ideal_monday || ''}
                onChange={(e) => handleChange('ideal_monday', e.target.value)}
                placeholder="Como é sua rotina?"
              />
            </div>
            <div className="bg-muted/40 border border-border p-6 rounded-xl space-y-3">
              <Label className="text-content text-lg font-semibold italic block">
                O que não faz mais
              </Label>
              <Input
                className="ds-input bg-surface-0"
                value={data.what_stops_doing || ''}
                onChange={(e) => handleChange('what_stops_doing', e.target.value)}
                placeholder="Ex: Microgerenciamento"
              />
            </div>
            <div className="bg-muted/40 border border-border p-6 rounded-xl space-y-3">
              <Label className="text-content text-lg font-semibold italic block">
                Número de pessoas
              </Label>
              <Input
                type="number"
                className="ds-input bg-surface-0"
                value={data.team_size || ''}
                onChange={(e) => handleChange('team_size', Number(e.target.value))}
                placeholder="Ex: 50"
              />
            </div>
            <div className="bg-muted/40 border border-border p-6 rounded-xl space-y-3">
              <Label className="text-content text-lg font-semibold italic block">
                Faturamento esperado
              </Label>
              <Input
                type="number"
                className="ds-input bg-surface-0"
                value={data.expected_revenue || ''}
                onChange={(e) => handleChange('expected_revenue', Number(e.target.value))}
                placeholder="R$"
              />
            </div>
            <div className="bg-muted/40 border border-border p-6 rounded-xl space-y-3">
              <Label className="text-content text-lg font-semibold italic block">
                Lucro esperado
              </Label>
              <Input
                type="number"
                className="ds-input bg-surface-0"
                value={data.expected_profit || ''}
                onChange={(e) => handleChange('expected_profit', Number(e.target.value))}
                placeholder="R$"
              />
            </div>
          </div>
        </div>

        {/* Modelo */}
        <div className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-2xl font-bold text-content flex items-baseline gap-2 italic">
              Modelo
              <small className="text-content-muted text-sm font-sans not-italic font-normal">
                1 ano
              </small>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/40 border border-border p-6 rounded-xl space-y-3">
              <Label className="text-content text-lg font-semibold italic block">
                Receita anual
              </Label>
              <Input
                type="number"
                className="ds-input bg-surface-0"
                value={data.annual_revenue || ''}
                onChange={(e) => handleChange('annual_revenue', Number(e.target.value))}
                placeholder="R$"
              />
            </div>
            <div className="bg-muted/40 border border-border p-6 rounded-xl space-y-3">
              <Label className="text-content text-lg font-semibold italic block">Lucro anual</Label>
              <Input
                type="number"
                className="ds-input bg-surface-0"
                value={data.annual_profit || ''}
                onChange={(e) => handleChange('annual_profit', Number(e.target.value))}
                placeholder="R$"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

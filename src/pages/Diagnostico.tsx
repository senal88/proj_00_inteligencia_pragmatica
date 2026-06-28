import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDefaultCompany, type Company } from '@/services/companies'
import { saveSCG, type SCG } from '@/services/scgs'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  { id: 1, title: 'Sintoma', description: 'O que está acontecendo?' },
  { id: 2, title: 'Causas', description: 'Por que isso acontece?' },
  { id: 3, title: 'Gargalo', description: 'Qual é o limitador principal?' },
  { id: 4, title: 'Solução', description: 'Como vamos resolver?' },
]

export default function Diagnostico() {
  const [step, setStep] = useState(1)
  const [company, setCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState<Partial<SCG>>({})
  const [isSaving, setIsSaving] = useState(false)

  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    getDefaultCompany().then(setCompany)
  }, [])

  const canAdvance = () => {
    if (step === 1)
      return formData.symptom_description && formData.symptom_magnitude && formData.symptom_duration
    if (step === 2) return formData.causes_identified
    if (step === 3) return formData.bottleneck_identified
    if (step === 4) return formData.chosen_solution && formData.validation_metric
    return false
  }

  const handleSave = async () => {
    if (!company) return
    setIsSaving(true)
    try {
      await saveSCG({
        ...formData,
        company_id: company.id,
        status: 'Solução em execução',
        diagnosis_date: new Date().toISOString(),
      })
      toast({
        title: 'Diagnóstico salvo!',
        description: 'O SCG foi registrado com sucesso.',
      })
      navigate('/scorecard')
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o diagnóstico.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 p-6">
      <div className="space-y-2">
        <h1 className="ds-dash-title">Diagnóstico SCG</h1>
        <p className="text-[var(--text-muted)] text-[14px]">
          Siga a metodologia Sintoma, Causa, Gargalo e Solução para resolver problemas complexos.
        </p>
      </div>

      <div className="flex items-center justify-between mb-8 relative py-4 mt-8">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[var(--border-soft)] z-0 rounded-full" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--accent)] z-0 transition-all duration-500 ease-in-out rounded-full"
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((s) => (
          <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 text-[14px]',
                step > s.id
                  ? 'bg-[var(--accent)] text-white'
                  : step === s.id
                    ? 'bg-[var(--bg-2)] border-2 border-[var(--accent)] text-[var(--accent)]'
                    : 'bg-[var(--bg-1)] border-2 border-[var(--border)] text-[var(--text-muted)]',
              )}
            >
              {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
            </div>
            <div className="text-[13px] font-medium text-center hidden sm:block absolute top-12 whitespace-nowrap">
              <div className={step >= s.id ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}>
                {s.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="ds-card mt-12 flex flex-col gap-[18px]">
        <div>
          <h2 className="ds-section-title text-[var(--accent)]">{steps[step - 1].title}</h2>
          <p className="text-[13px] text-[var(--text-muted)]">{steps[step - 1].description}</p>
        </div>

        <div className="min-h-[250px]">
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-fade-in-up">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="symptom_description"
                  className="text-[14px] font-medium text-[var(--text)]"
                >
                  O quê dói?
                </label>
                <input
                  id="symptom_description"
                  placeholder="Ex: Baixa conversão em vendas"
                  className="ds-input"
                  value={formData.symptom_description || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, symptom_description: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="symptom_magnitude"
                  className="text-[14px] font-medium text-[var(--text)]"
                >
                  Quanto?
                </label>
                <input
                  id="symptom_magnitude"
                  placeholder="Ex: Estamos perdendo 30% dos leads"
                  className="ds-input"
                  value={formData.symptom_magnitude || ''}
                  onChange={(e) => setFormData({ ...formData, symptom_magnitude: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="symptom_duration"
                  className="text-[14px] font-medium text-[var(--text)]"
                >
                  Desde quando?
                </label>
                <input
                  id="symptom_duration"
                  placeholder="Ex: Desde o último trimestre"
                  className="ds-input"
                  value={formData.symptom_duration || ''}
                  onChange={(e) => setFormData({ ...formData, symptom_duration: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4 animate-fade-in-up">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="causes_identified"
                  className="text-[14px] font-medium text-[var(--text)]"
                >
                  Liste as causas percorrendo as 6 áreas: Marketing, Vendas, Produto, Operações,
                  Pessoas, Capital
                </label>
                <textarea
                  id="causes_identified"
                  className="ds-input min-h-[160px] resize-none"
                  placeholder="Marketing: ...&#10;Vendas: ...&#10;Produto: ...&#10;Operações: ...&#10;Pessoas: ...&#10;Capital: ..."
                  value={formData.causes_identified || ''}
                  onChange={(e) => setFormData({ ...formData, causes_identified: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4 animate-fade-in-up">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="bottleneck_identified"
                  className="text-[14px] font-medium text-[var(--text)]"
                >
                  Qual causa, se resolvida, mata o sintoma?
                </label>
                <input
                  id="bottleneck_identified"
                  placeholder="Ex: Falta de treinamento prático no novo playbook de vendas"
                  className="ds-input"
                  value={formData.bottleneck_identified || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, bottleneck_identified: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4 animate-fade-in-up">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="chosen_solution"
                  className="text-[14px] font-medium text-[var(--text)]"
                >
                  Solução escolhida
                </label>
                <textarea
                  id="chosen_solution"
                  className="ds-input min-h-[120px] resize-none"
                  placeholder="Descreva o plano de ação que será aplicado..."
                  value={formData.chosen_solution || ''}
                  onChange={(e) => setFormData({ ...formData, chosen_solution: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="validation_metric"
                  className="text-[14px] font-medium text-[var(--text)]"
                >
                  Métrica de validação
                </label>
                <input
                  id="validation_metric"
                  placeholder="Ex: Aumento na conversão para 15% em 30 dias"
                  className="ds-input"
                  value={formData.validation_metric || ''}
                  onChange={(e) => setFormData({ ...formData, validation_metric: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between border-t border-[var(--border)] pt-4 mt-2">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || isSaving}
            className="ghost-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>

          {step < steps.length ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canAdvance()}
              className="primary-btn"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={!canAdvance() || isSaving}
              className="primary-btn !bg-green-600 hover:!bg-green-700"
            >
              {isSaving ? 'Salvando...' : 'Finalizar Diagnóstico'}
              <CheckCircle2 className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { getDefaultCompany, type Company } from '@/services/companies'
import { getDirectionStructured, type DirectionStructured } from '@/services/directions'
import { getQuarters, type Quarter } from '@/services/quarters'
import { getPGGs, type PGG } from '@/services/pggs'
import { getPMVByPGG, type PMV } from '@/services/pmvs'
import { getSCGs, type SCG } from '@/services/scgs'
import { Target, Trophy, DollarSign, TrendingUp, AlertTriangle, ChevronDown } from 'lucide-react'

export default function Scorecard() {
  const [company, setCompany] = useState<Company | null>(null)
  const [direction, setDirection] = useState<DirectionStructured | null>(null)
  const [quarters, setQuarters] = useState<Quarter[]>([])
  const [selectedQuarterId, setSelectedQuarterId] = useState<string>('')

  const [pggs, setPggs] = useState<PGG[]>([])
  const [pmv, setPmv] = useState<PMV | null>(null)
  const [latestScg, setLatestScg] = useState<SCG | null>(null)

  useEffect(() => {
    loadBaseData()
  }, [])

  const loadBaseData = async () => {
    try {
      const comp = await getDefaultCompany()
      setCompany(comp)
      const dir = await getDirectionStructured(comp.id)
      setDirection(dir)
      const qts = await getQuarters(comp.id)
      setQuarters(qts)
      if (qts.length > 0) {
        setSelectedQuarterId(qts[0].id)
      }
      const allScgs = await getSCGs()
      if (allScgs.length > 0) {
        setLatestScg(allScgs[0])
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (selectedQuarterId) {
      loadQuarterData(selectedQuarterId)
    }
  }, [selectedQuarterId])

  const loadQuarterData = async (qid: string) => {
    try {
      const qPggs = await getPGGs(qid)
      setPggs(qPggs)
      const domino = qPggs.find((p) => p.is_domino)
      if (domino && domino.id) {
        const dPmv = await getPMVByPGG(domino.id)
        setPmv(dPmv)
      } else {
        setPmv(null)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const formatCurrency = (value?: number) => {
    if (!value) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(dateString))
  }

  const pmvFields = [
    { key: 'r1_result', label: 'R1 - Resultado Esperado' },
    { key: 'r2_reason', label: 'R2 - Razão (Por que isso é importante?)' },
    { key: 'r3_reference', label: 'R3 - Referência (Quem já fez isso?)' },
    { key: 'r4_direction', label: 'R4 - Rumo (Marcos de sucesso)' },
    { key: 'r5_resources', label: 'R5 - Recursos (O que precisamos?)' },
    { key: 'r6_restrictions', label: 'R6 - Restrições (Limites do projeto)' },
    { key: 'r7_risks', label: 'R7 - Riscos (O que pode dar errado?)' },
    { key: 'r8_responsible', label: 'R8 - Responsável (Quem lidera?)' },
  ] as const

  return (
    <div className="bg-[var(--bg-0)] w-full">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 px-2 py-6 md:p-8 pb-24 md:pb-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="ds-dash-title text-[var(--text)]">Scorecard Estratégico</h1>
            <p className="text-[var(--text-muted)] text-[14px]">
              Visão consolidada da direção e progresso da empresa.
            </p>
          </div>
          <div className="w-full sm:w-64 relative">
            <select
              value={selectedQuarterId}
              onChange={(e) => setSelectedQuarterId(e.target.value)}
              className="ds-input appearance-none cursor-pointer pr-10"
            >
              {quarters.length === 0 && <option value="">Nenhum trimestre</option>}
              {quarters.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.year} - {q.quarter_number}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          </div>
        </div>

        <div className="ds-card relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)]" />
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--accent)]" />
              <h2 className="ds-section-title">Direção & Identidade</h2>
            </div>
            <p className="text-[13px] text-[var(--text-muted)]">
              Modelo:{' '}
              <span className="text-[var(--text)] font-medium">
                {company?.type || 'Não definido'}
              </span>
            </p>
            <div className="bg-[var(--bg-3)] p-3 md:p-4 rounded-[var(--radius)] border border-[var(--border-soft)] mt-2">
              <h4 className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-wider mb-2">
                Missão
              </h4>
              <p className="text-[16px] text-[var(--text)] leading-relaxed font-serif italic">
                "{direction?.mission_statement || 'Nenhuma missão definida.'}"
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="ds-card flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
              <Trophy className="w-[15px] h-[15px] text-yellow-500" />
              <span className="text-[13px] font-medium">Cena da Medalha</span>
            </div>
            <div className="text-[18px] font-bold text-white leading-tight">
              {direction?.medal_scene_type || 'N/A'}
            </div>
            <p
              className="text-[13px] text-[var(--text-dim)] line-clamp-2"
              title={direction?.medal_scene_description}
            >
              {direction?.medal_scene_description || 'Nenhuma descrição'}
            </p>
          </div>

          <div className="ds-card flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
              <DollarSign className="w-[15px] h-[15px] text-green-500" />
              <span className="text-[13px] font-medium">Faturamento Esperado</span>
            </div>
            <div className="text-[24px] font-bold text-white mt-auto">
              {formatCurrency(direction?.expected_revenue)}
            </div>
          </div>

          <div className="ds-card flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
              <TrendingUp className="w-[15px] h-[15px] text-blue-500" />
              <span className="text-[13px] font-medium">Lucro Esperado</span>
            </div>
            <div className="text-[24px] font-bold text-white mt-auto">
              {formatCurrency(direction?.expected_profit)}
            </div>
          </div>
        </div>

        <div className="ds-card flex flex-col gap-[14px]">
          <div>
            <h2 className="ds-section-title">PGGs do Trimestre</h2>
            <p className="text-[13px] text-[var(--text-muted)]">
              Passos Grandes e Grosseiros planejados.
            </p>
          </div>

          <div className="rounded-[var(--radius)] border border-[var(--border)] overflow-hidden bg-[var(--bg-1)]">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[var(--bg-3)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-2 py-3 md:p-3 font-medium text-[var(--text-muted)]">Área</th>
                  <th className="px-2 py-3 md:p-3 font-medium text-[var(--text-muted)]">
                    Ação Controlável
                  </th>
                  <th className="px-2 py-3 md:p-3 font-medium text-[var(--text-muted)]">
                    Resultado
                  </th>
                  <th className="px-2 py-3 md:p-3 font-medium text-[var(--text-muted)]">Prazo</th>
                  <th className="px-2 py-3 md:p-3 font-medium text-[var(--text-muted)]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-soft)]">
                {pggs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 md:p-6 text-center text-[var(--text-dim)]">
                      Nenhum PGG definido para este trimestre.
                    </td>
                  </tr>
                ) : (
                  pggs.map((pgg) => (
                    <tr key={pgg.id} className="hover:bg-[var(--bg-2)] transition-colors">
                      <td className="px-2 py-3 md:p-3">
                        <div className="flex flex-col items-start gap-1 font-medium">
                          {pgg.area}
                          {pgg.is_domino && (
                            <span className="new-tag text-[10px] leading-none px-2 py-1">
                              DOMINÓ
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className="px-2 py-3 md:p-3 max-w-[200px] truncate"
                        title={pgg.controllable_action}
                      >
                        {pgg.controllable_action || '-'}
                      </td>
                      <td
                        className="px-2 py-3 md:p-3 max-w-[200px] truncate"
                        title={pgg.courageous_result}
                      >
                        {pgg.courageous_result || '-'}
                      </td>
                      <td className="px-2 py-3 md:p-3 text-[var(--text-muted)] whitespace-nowrap">
                        {formatDate(pgg.deadline)}
                      </td>
                      <td className="px-2 py-3 md:p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-[4px] bg-[var(--bg-3)] text-[11px] text-[var(--text-muted)] border border-[var(--border-soft)]">
                          {pgg.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ds-card flex flex-col gap-[14px]">
          <div>
            <h2 className="ds-section-title">PMV Dominó (Os 8 Rs)</h2>
            <p className="text-[13px] text-[var(--text-muted)]">
              Detalhamento do projeto mais importante do trimestre (PMV).
            </p>
          </div>

          {pmv ? (
            <div className="flex flex-col gap-2 rounded-[var(--radius)] border border-[var(--border)] p-1 md:p-2 bg-[var(--bg-1)]">
              {pmvFields.map((field) => (
                <details
                  key={field.key}
                  className="group border-b border-[var(--border-soft)] last:border-0"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-2 py-3 md:p-3 font-medium text-[13px] text-[var(--text)] hover:text-[var(--accent)] transition-colors outline-none">
                    {field.label}
                    <ChevronDown className="w-4 h-4 text-[var(--text-muted)] transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-2 md:px-3 pb-3 text-[13px] text-[var(--text-muted)] whitespace-pre-wrap leading-relaxed">
                    {pmv[field.key as keyof PMV] || 'Não preenchido'}
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 md:py-10 bg-[var(--bg-1)] rounded-[var(--radius)] border border-[var(--border)] border-dashed px-2">
              <p className="text-[var(--text-dim)] text-[13px]">
                Não definido (Nenhum PMV Dominó detalhado para este trimestre).
              </p>
            </div>
          )}
        </div>

        <div className="ds-card flex flex-col gap-[14px]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-[18px] h-[18px] text-[var(--pink)]" />
            <div>
              <h2 className="ds-section-title">Último Diagnóstico (SCG)</h2>
              <p className="text-[13px] text-[var(--text-muted)]">
                O problema mais recente analisado na empresa.
              </p>
            </div>
          </div>

          {latestScg ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-[6px]">
                <h4 className="text-[11px] font-semibold text-[var(--text-dim)] uppercase">
                  Sintoma (A Dor)
                </h4>
                <div className="bg-[var(--bg-3)] p-2 md:p-[12px] rounded-[var(--radius)] border border-[var(--border-soft)] text-[13px] h-full">
                  <p className="text-[var(--text)]">{latestScg.symptom_description || 'N/A'}</p>
                  {latestScg.symptom_magnitude && (
                    <span className="block text-[12px] text-[var(--text-muted)] mt-2">
                      Magnitude: {latestScg.symptom_magnitude}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-[6px]">
                <h4 className="text-[11px] font-semibold text-[var(--text-dim)] uppercase">
                  Gargalo Identificado
                </h4>
                <div className="bg-[var(--bg-3)] p-2 md:p-[12px] rounded-[var(--radius)] border border-[var(--border-soft)] text-[13px] h-full text-[var(--text)]">
                  {latestScg.bottleneck_identified || 'N/A'}
                </div>
              </div>

              <div className="flex flex-col gap-[6px] md:col-span-2">
                <h4 className="text-[11px] font-semibold text-[var(--text-dim)] uppercase">
                  Solução & Métrica
                </h4>
                <div className="bg-[var(--bg-3)] p-2 md:p-[12px] rounded-[var(--radius)] border border-[var(--border-soft)] flex flex-col gap-3">
                  <div>
                    <span className="text-[12px] text-[var(--text-muted)] block mb-1">Ação:</span>
                    <p className="text-[13px] text-[var(--text)]">
                      {latestScg.chosen_solution || 'N/A'}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[var(--border-soft)]">
                    <span className="text-[12px] text-[var(--text-muted)] block mb-1">
                      Validação:
                    </span>
                    <p className="text-[13px] font-medium text-[var(--accent)]">
                      {latestScg.validation_metric || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 text-[11px] text-[var(--text-dim)] text-right mt-2">
                Diagnosticado em: {formatDate(latestScg.diagnosis_date || latestScg.created)} •
                Status: {latestScg.status || 'N/A'}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 md:py-8 bg-[var(--bg-1)] rounded-[var(--radius)] border border-[var(--border)] border-dashed px-2">
              <p className="text-[var(--text-dim)] text-[13px]">
                Nenhum diagnóstico SCG realizado ainda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

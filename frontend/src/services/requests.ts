import { useQuery } from '@tanstack/react-query'
import { agendamentoService } from './agendamento.service'
export interface Agendamento {
  id: string
  nome: string
  telefone: string
  rua: string
  quadra: string | null
  lote: string | null
  cidade: string
  dataSolicitacao: string
  observacoes: string | null
  status: 'PENDENTE' | 'CADASTRADO'
  criadoEm: string
  atualizadoEm: string
  arquivadoEm: string | null
  criadoPorId: string
}
export type CreateAgendamento = Pick<Agendamento, 'nome' | 'telefone' | 'rua' | 'cidade' | 'dataSolicitacao' | 'criadoPorId'> & Partial<Pick<Agendamento, 'quadra' | 'lote' | 'observacoes'>>
export function useRequests() {
  return useQuery({ queryKey: ['agendamentos'], queryFn: agendamentoService.listar, refetchInterval: 30_000 })
}
export function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? '—' : date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

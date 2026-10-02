export interface CreateAgendamentoModel {
  nome: string
  rua: string
  quadra?: string
  lote?: string
  cidade: string
  telefone: string
  dataSolicitacao: Date
  observacoes?: string
  criadoPorId: string
}
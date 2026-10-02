import { agendamentoRepository } from "@/repositories/agendamento.repository"
import { CreateAgendamentoModel } from "@/models/agendamento.model"

class AgendamentoService {
  async create(data: CreateAgendamentoModel) {
    return agendamentoRepository.create(data)
  }

  async list() {
    return agendamentoRepository.findAll()
  }

  async findById(id: string) {
    const agendamento =
      await agendamentoRepository.findById(id)

    if (!agendamento) {
      throw new Error("Agendamento não encontrado")
    }

    return agendamento
  }
}

export const agendamentoService =
  new AgendamentoService()
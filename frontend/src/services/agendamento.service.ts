import { api } from "./api"
import type { Agendamento, CreateAgendamento } from './requests'

export const agendamentoService = {
  async listar() {
    const response =
      await api.get<Agendamento[]>("/agendamentos")

    return response.data
  },

  async cadastrar(data: CreateAgendamento) {
    const response =
      await api.post<Agendamento>("/agendamentos", data)

    return response.data
  },
}

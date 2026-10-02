import { api } from "./api"

export const agendamentoService = {
  async listar() {
    const response =
      await api.get("/agendamentos")

    return response.data
  },

  async cadastrar(data: unknown) {
    const response =
      await api.post("/agendamentos", data)

    return response.data
  },
}
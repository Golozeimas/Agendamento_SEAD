import { FastifyInstance } from "fastify"

import { agendamentoRoutes } from "../routes/agendamento.routes"

export async function routes(app: FastifyInstance) {
  app.register(
    agendamentoRoutes,
    {
      prefix: "/agendamentos",
    }
  )
}
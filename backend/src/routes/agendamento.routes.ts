import { FastifyInstance } from "fastify"

import { agendamentoController } from "../controllers/agendamento.controller"

export async function agendamentoRoutes(
  app: FastifyInstance
) {
  app.get(
    "/",
    agendamentoController.index
  )

  app.post(
    "/",
    agendamentoController.create
  )
}
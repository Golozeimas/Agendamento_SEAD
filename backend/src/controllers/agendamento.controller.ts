import { FastifyReply, FastifyRequest } from "fastify"
import { agendamentoService } from "../services/agendamento.service"

class AgendamentoController {
  async create(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const agendamento =
      await agendamentoService.create(
        request.body as any
      )

    return reply
      .status(201)
      .send(agendamento)
  }

  async index(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const agendamentos =
      await agendamentoService.list()

    return reply.send(agendamentos)
  }
}

export const agendamentoController =
  new AgendamentoController()
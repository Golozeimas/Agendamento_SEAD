import { prisma } from "../config/prisma"
import { CreateAgendamentoModel } from "../models/agendamento.model"

class AgendamentoRepository {
  async create(data: CreateAgendamentoModel) {
    return prisma.agendamento.create({
      data,
    })
  }

  async findAll() {
    return prisma.agendamento.findMany({
      where: {
        arquivadoEm: null,
      },

      orderBy: {
        criadoEm: "desc",
      },
    })
  }

  async findById(id: string) {
    return prisma.agendamento.findUnique({
      where: { id },
    })
  }
}

export const agendamentoRepository =
  new AgendamentoRepository()
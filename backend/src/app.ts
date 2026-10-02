import Fastify from "fastify"
import cors from "@fastify/cors"

import { routes } from "@/routes"

export const app = Fastify({
  logger: true,
})

app.register(cors, {
  origin: true,
  credentials: true,
})

app.register(routes, {
  prefix: "/api",
})
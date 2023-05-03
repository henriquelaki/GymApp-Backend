import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeSearchGymUseCase } from '@/use-cases/factories/make-search-gyms-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().int().positive().default(1),
  })

  const { query, page } = searchGymsQuerySchema.parse(request.query)

  const searchGymUseCase = makeSearchGymUseCase()
  const { gyms } = await searchGymUseCase.execute({ query, page })

  return reply.status(200).send({ gyms })
}

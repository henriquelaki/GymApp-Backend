import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { isValidLatitude, isValidLongitude } from '@/utils/validate-coordinates'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.coerce.number().refine((value) => isValidLatitude),
    longitude: z.coerce.number().refine((value) => isValidLongitude),
  })

  const newGym = createGymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()
  await createGymUseCase.execute(newGym)

  return reply.status(201).send()
}

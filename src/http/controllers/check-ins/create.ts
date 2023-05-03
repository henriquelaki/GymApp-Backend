import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { isValidLatitude, isValidLongitude } from '@/utils/validate-coordinates'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInsParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => isValidLatitude),
    longitude: z.number().refine((value) => isValidLongitude),
  })

  const { gymId } = createCheckInsParamsSchema.parse(request.params)
  const { latitude: userLatitude, longitude: userLongitude } =
    createCheckInBodySchema.parse(request.body)

  const checkInUseCase = makeCheckInUseCase()
  await checkInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude,
    userLongitude,
  })

  return reply.status(201).send()
}

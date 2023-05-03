import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { isValidLatitude, isValidLongitude } from '@/utils/validate-coordinates'
import { makeFetchNearbyGyms } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => isValidLatitude),
    longitude: z.coerce.number().refine((value) => isValidLongitude),
    page: z.coerce.number().int().positive().default(1),
  })

  const {
    latitude: userLatitude,
    longitude: userLongitude,
    page,
  } = nearbyGymsQuerySchema.parse(request.query)

  const userCoordinates = { userLatitude, userLongitude }
  const fetchNearbyGymsUseCase = makeFetchNearbyGyms()
  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userCoordinates,
    page,
  })

  return reply.status(200).send({ gyms })
}

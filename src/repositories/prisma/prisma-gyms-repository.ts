import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { prisma } from '@/lib/prisma'
import { env } from '@/env'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: { id },
    })

    return gym
  }

  async findManyNearby(
    { latitude, longitude }: FindManyNearbyParams,
    page: number,
  ) {
    const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT 
      * 
    FROM gyms
    WHERE ( 6371 * acos( cos( radians(${latitude}) ) 
            * cos( radians( latitude ) )
            * cos( radians( longitude ) - radians(${longitude}) ) 
            + sin( radians(${latitude}) ) 
            * sin( radians( latitude ) ) ) ) <= ${env.MAX_KILOMETER_DISTANCE}
    `
    return gyms.slice(
      (page - 1) * env.PAGINATION_LIMIT,
      page * env.PAGINATION_LIMIT,
    )
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      skip: (page - 1) * env.PAGINATION_LIMIT,
      take: env.PAGINATION_LIMIT,
    })

    return gyms
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }
}

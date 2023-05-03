import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { randomUUID } from 'crypto'
import { getDistanceInKilometersBetweenCoordinates } from '@/utils/get-distances-between-coordinates'
import { env } from '@/env'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string) {
    const gym = this.items.find((gym) => gym.id === id)
    return gym || null
  }

  async findManyNearby(
    params: FindManyNearbyParams,
    page: number,
  ): Promise<Gym[]> {
    return this.items
      .filter((item) => {
        const distance = getDistanceInKilometersBetweenCoordinates(
          {
            latitude: params.latitude,
            longitude: params.longitude,
          },
          {
            latitude: item.latitude.toNumber(),
            longitude: item.longitude.toNumber(),
          },
        )

        return distance <= env.MAX_KILOMETER_DISTANCE
      })
      .slice((page - 1) * env.PAGINATION_LIMIT, page * env.PAGINATION_LIMIT)
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * env.PAGINATION_LIMIT, page * env.PAGINATION_LIMIT)
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }
    this.items.push(gym)
    return gym
  }
}

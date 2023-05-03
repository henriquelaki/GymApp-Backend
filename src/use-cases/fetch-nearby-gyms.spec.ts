import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'
import { Decimal } from '@prisma/client/runtime'
import { env } from '@/env'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase
let userCoordinates: any

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
    userCoordinates = {
      userLatitude: -23.6814347,
      userLongitude: -46.9249399,
    }
  })

  it('Should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Nearby Gym 1',
      description: 'Gym Description',
      phone: '123456789',
      latitude: new Decimal(-23.6814347),
      longitude: new Decimal(-46.9249399),
    })

    await gymsRepository.create({
      title: 'Nearby Gym 2',
      description: 'Gym Description',
      phone: '123456789',
      latitude: new Decimal(-23.6814347),
      longitude: new Decimal(-46.9249399),
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'Gym Description',
      phone: 'phone-number',
      latitude: new Decimal(-23.5444064),
      longitude: new Decimal(-46.7283586),
    })

    const { gyms } = await sut.execute({ userCoordinates, page: 1 })
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Nearby Gym 1',
      }),
      expect.objectContaining({
        title: 'Nearby Gym 2',
      }),
    ])
  })

  it('Should be able to search paginated nearby gyms list', async () => {
    for (let i = 1; i <= env.PAGINATION_LIMIT + 2; i++) {
      await gymsRepository.create({
        title: `Nearby Gym ${i}`,
        description: 'Gym Description',
        phone: '123456789',
        latitude: new Decimal(-23.6814347),
        longitude: new Decimal(-46.9249399),
      })
    }

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'Gym Description',
      phone: 'phone-number',
      latitude: new Decimal(-23.5444064),
      longitude: new Decimal(-46.7283586),
    })

    const { gyms } = await sut.execute({ userCoordinates, page: 2 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Nearby Gym 21',
      }),
      expect.objectContaining({
        title: 'Nearby Gym 22',
      }),
    ])
  })
})

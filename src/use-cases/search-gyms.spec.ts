import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymUseCase } from './search-gyms'
import { env } from '@/env'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymUseCase(gymsRepository)
  })

  it('Should be able to search gyms by name', async () => {
    await gymsRepository.create({
      title: 'Will not search this one',
      description: 'Gym Description',
      phone: 'phone-number',
      latitude: 1,
      longitude: 1,
    })

    await gymsRepository.create({
      title: 'Gym Name 1',
      description: 'Gym Description',
      phone: 'phone-number',
      latitude: 1,
      longitude: 1,
    })

    await gymsRepository.create({
      title: 'Gym Name 2',
      description: 'Gym Description',
      phone: 'phone-number',
      latitude: 1,
      longitude: 1,
    })

    const { gyms } = await sut.execute({ query: 'Gym Name', page: 1 })
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Gym Name 1',
      }),
      expect.objectContaining({
        title: 'Gym Name 2',
      }),
    ])
  })

  it('Should be able to search paginated gyms list by title', async () => {
    for (let i = 1; i <= env.PAGINATION_LIMIT + 2; i++) {
      await gymsRepository.create({
        title: `Gym Name ${i}`,
        description: 'Gym Description',
        phone: 'phone-number',
        latitude: 1,
        longitude: 1,
      })
    }

    const { gyms } = await sut.execute({ query: 'Gym Name', page: 2 })
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Gym Name 21',
      }),
      expect.objectContaining({
        title: 'Gym Name 22',
      }),
    ])
  })
})

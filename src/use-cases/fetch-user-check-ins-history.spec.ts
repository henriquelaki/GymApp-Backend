import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'
import { env } from '@/env'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-In History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('Should be able to fetch user check-ins history', async () => {
    const { id: firstCheckInId } = await checkInsRepository.create({
      gym_id: 'gym-id-1',
      user_id: 'user-id-1',
    })

    const { id: secondCheckInId } = await checkInsRepository.create({
      gym_id: 'gym-id-1',
      user_id: 'user-id-1',
    })

    const { checkIns } = await sut.execute({ userId: 'user-id-1', page: 1 })
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        id: firstCheckInId,
        gym_id: 'gym-id-1',
        user_id: 'user-id-1',
      }),
      expect.objectContaining({
        id: secondCheckInId,
        gym_id: 'gym-id-1',
        user_id: 'user-id-1',
      }),
    ])
  })

  it('Should be able to fetch paginated user check-ins history', async () => {
    const checkInsIds: string[] = []

    for (let i = 1; i <= env.PAGINATION_LIMIT + 2; i++) {
      const { id } = await checkInsRepository.create({
        gym_id: `gym-id-${i}`,
        user_id: `user-id-1`,
      })
      checkInsIds.push(id)
    }

    const { checkIns } = await sut.execute({ userId: 'user-id-1', page: 2 })
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'gym-id-21',
        user_id: 'user-id-1',
      }),
      expect.objectContaining({
        gym_id: 'gym-id-22',
        user_id: 'user-id-1',
      }),
    ])
  })
})

import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase
let gymId: string

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    const newGymToCreate = {
      title: 'Gym Name',
      description: 'Gym Description',
      phone: '123456789',
      latitude: new Decimal(-23.6814347),
      longitude: new Decimal(-46.9249399),
    }

    const newGym = await gymsRepository.create(newGymToCreate)
    gymId = newGym.id

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to check in', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId,
      userLatitude: -23.6814347,
      userLongitude: -46.9249399,
    })

    expect(checkIn.user_id).toEqual('user-id')
    expect(checkIn.gym_id).toEqual(gymId)
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in twice on same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await sut.execute({
      userId: 'user-id',
      gymId,
      userLatitude: -23.6814347,
      userLongitude: -46.9249399,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId,
        userLatitude: -23.6814347,
        userLongitude: -46.9249399,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('Should be able to check in twice on different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await sut.execute({
      userId: 'user-id',
      gymId,
      userLatitude: -23.6814347,
      userLongitude: -46.9249399,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId,
      userLatitude: -23.6814347,
      userLongitude: -46.9249399,
    })

    expect(checkIn.user_id).toEqual('user-id')
    expect(checkIn.gym_id).toEqual(gymId)
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in on distant gym', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const secondGym = await gymsRepository.create({
      title: 'Gym Name',
      description: 'Gym Description',
      phone: '123456789',
      latitude: new Decimal(-23.5444064),
      longitude: new Decimal(-46.7283586),
    })

    const secondGymId = secondGym.id

    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: secondGymId,
        userLatitude: -23.6814347,
        userLongitude: -46.9249399,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})

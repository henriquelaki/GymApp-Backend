import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase
const title = 'Gym Name'
const description = 'Gym Description'
const phone = 'phone-number'
const latitude = 1
const longitude = 1
const gymToCreate = {
  title,
  description,
  phone,
  latitude,
  longitude,
}

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('Should be able to create a gyn', async () => {
    const { gym } = await sut.execute(gymToCreate)

    expect(gym.id).toEqual(expect.any(String))
    expect(gym.title).toEqual(title)
    expect(gym.description).toEqual(description)
    expect(gym.phone).toEqual(phone)
    expect(gym.latitude.toNumber()).toEqual(latitude)
    expect(gym.longitude.toNumber()).toEqual(longitude)
  })
})

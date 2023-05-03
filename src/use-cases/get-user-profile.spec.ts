import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase
let createdUser: any
const name = 'John Doe'
const email = 'john.doe@mail.com'
const password = '123456'

describe('Get User Profile Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)

    createdUser = await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6),
    })
  })

  it('Should be able to get user profile', async () => {
    const { user } = await sut.execute({ userId: createdUser.id })
    expect(user.id).toEqual(createdUser.id)
    expect(user.name).toEqual(name)
    expect(user.email).toEqual(email)
  })

  it('Should not be able to get user profile when user id does not exists', async () => {
    const invalidId = 'non-existing-id'

    await expect(() =>
      sut.execute({ userId: invalidId }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

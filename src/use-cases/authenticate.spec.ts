import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { compare, hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidCredentialsError } from './errors/invalid-credential-errors'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase
const name = 'John Doe'
const email = 'john.doe@mail.com'
const password = '123456'
const userToAuthenticate = { email, password }

describe('Authenticate Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6),
    })
  })

  it('Should be able to authenticate', async () => {
    const { user } = await sut.execute(userToAuthenticate)
    const isUserAuthenticatedSuccessfully = await compare(
      password,
      user.password_hash,
    )
    expect(isUserAuthenticatedSuccessfully).toBe(true)
  })

  it('Should not be able to authenticate with wrong email', async () => {
    const userWithWrongEmail = {
      ...userToAuthenticate,
      email: 'john.wrong@email.com',
    }

    await expect(() => sut.execute(userWithWrongEmail)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('Should not be able to authenticate with wrong password', async () => {
    const userWithWrongPassword = {
      ...userToAuthenticate,
      password: 'wrong-password',
    }

    await expect(() =>
      sut.execute(userWithWrongPassword),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})

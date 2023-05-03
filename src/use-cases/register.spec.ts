import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase
const name = 'John Doe'
const email = 'john.doe@mail.com'
const password = '123456'
const userToRegister = { name, email, password }

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('Should encrypt passwords with a hash upon registration', async () => {
    const { user } = await sut.execute(userToRegister)
    const isPasswordCorrectlyHashed = await compare(
      password,
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Should not be able to register same email twice', async () => {
    await sut.execute(userToRegister)

    await expect(() => sut.execute(userToRegister)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })

  it('Should be able to register a user', async () => {
    const { user } = await sut.execute(userToRegister)

    expect(user.id).toEqual(expect.any(String))
  })
})

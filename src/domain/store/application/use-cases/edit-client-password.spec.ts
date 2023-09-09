import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { EditClientPasswordUseCase } from './edit-client-password'
import { makeClient } from 'test/factories/make-client'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

describe('Edit client password', () => {
  let inMemoryClientsRepository: InMemoryClientsRepository
  let hashGenerator: FakeHasher
  let hashComparer: FakeHasher
  let sut: EditClientPasswordUseCase

  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    hashGenerator = new FakeHasher()
    hashComparer = new FakeHasher()
    sut = new EditClientPasswordUseCase(
      inMemoryClientsRepository,
      hashComparer,
      hashGenerator,
    )
  })

  it('should be able to edit client password', async () => {
    const client = makeClient({
      password: await hashGenerator.hash('password'),
    })

    inMemoryClientsRepository.create(client)

    const result = await sut.execute({
      clientId: client.id.toString(),
      currentPassword: 'password',
      newPassword: 'password123',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryClientsRepository.items[0].password).toEqual(
        'password123-hashed',
      )
    }
  })

  it('should not be able to edit client password with invalid credential', async () => {
    const client = makeClient({
      password: await hashGenerator.hash('password'),
    })

    inMemoryClientsRepository.create(client)

    const result = await sut.execute({
      clientId: client.id.toString(),
      currentPassword: 'password333',
      newPassword: 'password123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})

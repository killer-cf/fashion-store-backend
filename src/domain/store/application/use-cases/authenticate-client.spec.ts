import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateClientUseCase } from './authenticate-client'
import { makeClient } from 'test/factories/make-client'

describe('Authenticate client', () => {
  let inMemoryClientsRepository: InMemoryClientsRepository
  let hashComparer: FakeHasher
  let fakeHasher: FakeHasher
  let encrypter: FakeEncrypter
  let sut: AuthenticateClientUseCase

  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    hashComparer = new FakeHasher()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()
    sut = new AuthenticateClientUseCase(
      inMemoryClientsRepository,
      encrypter,
      hashComparer,
    )
  })

  it('should be able to authenticate a client', async () => {
    const client = makeClient({
      email: 'jose@gmail.com',
      password: await fakeHasher.hash('password'),
    })

    inMemoryClientsRepository.create(client)

    const result = await sut.execute({
      email: 'jose@gmail.com',
      password: 'password',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.access_token).toEqual(expect.any(String))
    }
  })
})

import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { RegisterClientUseCase } from './register-client'
import { FakeHasher } from 'test/cryptography/fake-hasher'

describe('Register client', () => {
  let inMemoryClientsRepository: InMemoryClientsRepository
  let hashGenerator: FakeHasher
  let sut: RegisterClientUseCase

  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    hashGenerator = new FakeHasher()
    sut = new RegisterClientUseCase(inMemoryClientsRepository, hashGenerator)
  })

  it('should be able to register a client', async () => {
    const result = await sut.execute({
      name: 'Jose',
      email: 'jose@gmail.com',
      phone: '123456',
      password: 'password',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryClientsRepository.items[0]).toEqual(result.value?.client)
      expect(inMemoryClientsRepository.items[0].password).toEqual(
        'password-hashed',
      )
    }
  })
})

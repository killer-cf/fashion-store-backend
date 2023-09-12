import { Either, left, right } from '@/core/either'
import { Client } from '../../enterprise/entities/client'
import { ClientAlreadyExistsError } from './errors/client-already-exists-error'
import { ClientsRepository } from '../repositories/clients-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { Injectable } from '@nestjs/common'

interface RegisterClientUseCaseRequest {
  name: string
  email: string
  password: string
  phone: string
}

type RegisterClientUseCaseResponse = Either<
  ClientAlreadyExistsError,
  {
    client: Client
  }
>

@Injectable()
export class RegisterClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    phone,
  }: RegisterClientUseCaseRequest): Promise<RegisterClientUseCaseResponse> {
    const clientWithSameEmail = await this.clientsRepository.findByEmail(email)

    if (clientWithSameEmail) {
      return left(new ClientAlreadyExistsError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const client = Client.create({
      name,
      email,
      phone,
      password: hashedPassword,
    })

    await this.clientsRepository.create(client)

    return right({ client })
  }
}

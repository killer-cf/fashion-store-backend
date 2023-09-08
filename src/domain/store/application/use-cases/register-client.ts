import { Either, left, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { ProductAlreadyExistsError } from './errors/product-already-exists-error'
import { ClientsRepository } from '../repositories/clients-repository'
import { Client } from '../../enterprise/entities/client'
import { ClientAlreadyExistsError } from './errors/client-already-exists-error'

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

export class RegisterClientUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

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

    const client = Client.create({
      name,
      email,
      password,
      phone,
    })

    await this.clientsRepository.create(client)

    return right({ client })
  }
}
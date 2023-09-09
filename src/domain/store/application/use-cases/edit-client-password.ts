import { Either, left, right } from '@/core/either'
import { Client } from '../../enterprise/entities/client'
import { ClientsRepository } from '../repositories/clients-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { HashComparer } from '../cryptography/hash-comparer'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface EditClientPasswordUseCaseRequest {
  clientId: string
  currentPassword: string
  newPassword: string
}

type EditClientPasswordUseCaseResponse = Either<
  ResourceNotFoundError | WrongCredentialsError,
  {
    client: Client
  }
>

export class EditClientPasswordUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    clientId,
    currentPassword,
    newPassword,
  }: EditClientPasswordUseCaseRequest): Promise<EditClientPasswordUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId)

    if (!client) {
      return left(new ResourceNotFoundError())
    }

    const validCurrentPassword = await this.hashComparer.compare(
      currentPassword,
      client.password,
    )

    if (!validCurrentPassword) {
      return left(new WrongCredentialsError())
    }

    const newHashedPassword = await this.hashGenerator.hash(newPassword)

    client.password = newHashedPassword

    await this.clientsRepository.save(client)

    return right({ client })
  }
}

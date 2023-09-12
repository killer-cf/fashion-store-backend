import { Either, left, right } from '@/core/either'
import { ClientsRepository } from '../repositories/clients-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { Injectable } from '@nestjs/common'

interface AuthenticateClientUseCaseRequest {
  email: string
  password: string
}

type AuthenticateClientUseCaseResponse = Either<
  WrongCredentialsError,
  {
    access_token: string
  }
>

@Injectable()
export class AuthenticateClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private encrypter: Encrypter,
    private hashComparer: HashComparer,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateClientUseCaseRequest): Promise<AuthenticateClientUseCaseResponse> {
    const client = await this.clientsRepository.findByEmail(email)

    if (!client) {
      return left(new WrongCredentialsError())
    }

    const validPassword = await this.hashComparer.compare(
      password,
      client.password,
    )

    if (!validPassword) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({ id: client.id })

    return right({ access_token: accessToken })
  }
}

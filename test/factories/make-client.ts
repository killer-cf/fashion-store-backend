import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Client, ClientProps } from '@/domain/store/enterprise/entities/client'
import { PrismaClientMapper } from '@/infra/database/prisma/mappers/prisma-client-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeClient(
  override: Partial<ClientProps> = {},
  id?: UniqueEntityID,
) {
  const client = Client.create(
    {
      name: faker.vehicle.vehicle(),
      email: faker.internet.email(),
      phone: faker.number.int(8).toString(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return client
}

@Injectable()
export class ClientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaClient(data: Partial<ClientProps> = {}): Promise<Client> {
    const client = makeClient(data)

    await this.prisma.user.create({
      data: PrismaClientMapper.toPrisma(client),
    })

    return client
  }
}

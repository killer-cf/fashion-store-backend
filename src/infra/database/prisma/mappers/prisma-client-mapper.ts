import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Client } from '@/domain/store/enterprise/entities/client'
import { User as PrismaClient, Prisma } from '@prisma/client'

export class PrismaClientMapper {
  static toDomain(raw: PrismaClient): Client {
    return Client.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        phone: raw.phone ?? '',
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(client: Client): Prisma.UserUncheckedCreateInput {
    return {
      id: client.id.toString(),
      name: client.name,
      email: client.email,
      password: client.password,
    }
  }
}

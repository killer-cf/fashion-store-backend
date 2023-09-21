import { ClientsRepository } from '@/domain/store/application/repositories/clients-repository'
import { Client } from '@/domain/store/enterprise/entities/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaClientMapper } from '../mappers/prisma-client-mapper'

@Injectable()
export class PrismaClientsRepository implements ClientsRepository {
  constructor(private prisma: PrismaService) {}
  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.user.findUnique({
      where: {
        email,
        role: 'CLIENT',
      },
    })

    if (!client) {
      return null
    }

    return PrismaClientMapper.toDomain(client)
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.user.findUnique({
      where: { id, role: 'CLIENT' },
    })

    if (!client) {
      return null
    }

    return PrismaClientMapper.toDomain(client)
  }

  async create(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(client)

    await this.prisma.user.create({
      data,
    })
  }

  async save(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(client)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}

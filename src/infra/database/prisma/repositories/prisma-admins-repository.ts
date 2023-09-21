import { AdminsRepository } from '@/domain/store/application/repositories/admins-repository'
import { Admin } from '@/domain/store/enterprise/entities/admin'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}
  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        email,
        role: 'ADMIN',
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: { id, role: 'ADMIN' },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.create({
      data,
    })
  }

  async save(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}

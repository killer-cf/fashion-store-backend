import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin } from '@/domain/store/enterprise/entities/admin'
import { User as PrismaAdmin, Prisma } from '@prisma/client'

export class PrismaAdminMapper {
  static toDomain(raw: PrismaAdmin): Admin {
    return Admin.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      email: admin.email,
      password: admin.password,
      role: 'ADMIN',
    }
  }
}

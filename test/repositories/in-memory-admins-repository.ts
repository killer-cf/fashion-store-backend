import { AdminsRepository } from '@/domain/store/application/repositories/admins-repository'
import { Admin } from '@/domain/store/enterprise/entities/admin'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async findById(id: string): Promise<Admin | null> {
    const admin = this.items.find((admin) => admin.id.toString() === id)

    if (!admin) {
      return null
    }

    return admin
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = this.items.find((admin) => admin.email === email)

    if (!admin) {
      return null
    }

    return admin
  }

  async create(admin: Admin): Promise<void> {
    this.items.push(admin)
  }

  async save(admin: Admin): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === admin.id)

    this.items[itemIndex] = admin
  }
}

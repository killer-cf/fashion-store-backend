import { ClientsRepository } from '@/domain/store/application/repositories/clients-repository'
import { Client } from '@/domain/store/enterprise/entities/client'

export class InMemoryClientsRepository implements ClientsRepository {
  public items: Client[] = []

  async findByEmail(email: string): Promise<Client | null> {
    const client = this.items.find((client) => client.email === email)

    if (!client) {
      return null
    }

    return client
  }

  async create(client: Client): Promise<void> {
    this.items.push(client)
  }
}

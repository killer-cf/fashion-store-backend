import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Client, ClientProps } from '@/domain/store/enterprise/entities/client'
import { faker } from '@faker-js/faker'

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

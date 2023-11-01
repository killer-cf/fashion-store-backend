import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { ListClientOrdersUseCase } from './list-client-orders'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryBrandsRepository } from 'test/repositories/in-memory-brands-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryProductCategoriesRepository } from 'test/repositories/in-memory-product-categories-repository'
import { InMemoryProductImagesRepository } from 'test/repositories/in-memory-product-images-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { makeClient } from 'test/factories/make-client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

describe('List client Orders', () => {
  let inMemoryClientsRepository: InMemoryClientsRepository
  let inMemoryProductCategoriesRepository: InMemoryProductCategoriesRepository
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository
  let inMemoryProductImagesRepository: InMemoryProductImagesRepository
  let inMemoryProductsRepository: InMemoryProductsRepository
  let inMemoryBrandsRepository: InMemoryBrandsRepository
  let inMemoryImagesRepository: InMemoryImagesRepository
  let inMemoryOrdersRepository: InMemoryOrdersRepository
  let sut: ListClientOrdersUseCase

  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    inMemoryProductCategoriesRepository =
      new InMemoryProductCategoriesRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryProductImagesRepository = new InMemoryProductImagesRepository()
    inMemoryBrandsRepository = new InMemoryBrandsRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemoryProductImagesRepository,
      inMemoryBrandsRepository,
      inMemoryImagesRepository,
      inMemoryProductCategoriesRepository,
      inMemoryCategoriesRepository,
    )
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryProductsRepository,
    )
    sut = new ListClientOrdersUseCase(inMemoryOrdersRepository)
  })

  it('should be able to list client orders', async () => {
    const client = makeClient()
    inMemoryClientsRepository.create(client)

    inMemoryOrdersRepository.create(
      makeOrder({
        clientId: client.id,
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        clientId: client.id,
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        clientId: new UniqueEntityID('another client id'),
      }),
    )

    const result = await sut.execute({
      page: 1,
      clientId: client.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.clientOrders).toHaveLength(2)
  })

  it('should be able to list paginated orders', async () => {
    const client = makeClient()
    inMemoryClientsRepository.create(client)

    for (let i = 1; i <= 22; i++) {
      inMemoryOrdersRepository.create(
        makeOrder({
          clientId: client.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      clientId: client.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.clientOrders).toHaveLength(2)
  })
})

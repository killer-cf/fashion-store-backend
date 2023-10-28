import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { CreateOrderUseCase } from './create-order'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { InMemoryProductImagesRepository } from 'test/repositories/in-memory-product-images-repository'
import { InMemoryBrandsRepository } from 'test/repositories/in-memory-brands-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryProductCategoriesRepository } from 'test/repositories/in-memory-product-categories-repository'

describe('Create Order', () => {
  let inMemoryProductCategoriesRepository: InMemoryProductCategoriesRepository
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository
  let inMemoryBrandsRepository: InMemoryBrandsRepository
  let inMemoryImagesRepository: InMemoryImagesRepository
  let inMemoryProductImagesRepository: InMemoryProductImagesRepository
  let inMemoryOrdersRepository: InMemoryOrdersRepository
  let inMemoryProductsRepository: InMemoryProductsRepository
  let sut: CreateOrderUseCase

  beforeEach(() => {
    inMemoryProductCategoriesRepository =
      new InMemoryProductCategoriesRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryBrandsRepository = new InMemoryBrandsRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryProductImagesRepository = new InMemoryProductImagesRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemoryProductImagesRepository,
      inMemoryBrandsRepository,
      inMemoryImagesRepository,
      inMemoryProductCategoriesRepository,
      inMemoryCategoriesRepository,
    )
    sut = new CreateOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryProductsRepository,
    )
  })

  it('should be able to create a order', async () => {
    const product1 = makeProduct({
      price: 1000,
    })
    const product2 = makeProduct({
      price: 2000,
    })

    inMemoryProductsRepository.create(product1)
    inMemoryProductsRepository.create(product2)

    const result = await sut.execute({
      clientId: 'client-id',
      address: 'rua oscar raposso, 188',
      items: [
        {
          productId: product1.id.toString(),
          quantity: 2,
        },
        {
          productId: product2.id.toString(),
          quantity: 3,
        },
      ],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryOrdersRepository.items[0]).toEqual(result.value?.order)
      expect(inMemoryOrdersRepository.items[0].state.toString()).toEqual(
        'PENDING',
      )
      expect(inMemoryOrdersRepository.items[0].totalPrice).toEqual(8000)
      expect(inMemoryOrdersRepository.items[0].items).toHaveLength(2)
    }
  })

  it('should not be able to create a order with invalid items', async () => {
    const product1 = makeProduct({
      price: 1000,
    })
    const product2 = makeProduct({
      price: 2000,
    })

    inMemoryProductsRepository.create(product1)
    inMemoryProductsRepository.create(product2)

    const result = await sut.execute({
      clientId: 'client-id',
      address: 'rua oscar raposso, 188',
      items: [
        {
          productId: 'invalid-id',
          quantity: 2,
        },
        {
          productId: product2.id.toString(),
          quantity: 3,
        },
      ],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

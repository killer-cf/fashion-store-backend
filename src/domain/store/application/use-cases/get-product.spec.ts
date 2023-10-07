import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { InMemoryProductImagesRepository } from 'test/repositories/in-memory-product-images-repository'
import { ProductStatus } from '../../enterprise/entities/value-objects/product-status'
import { GetProductUseCase } from './get-product'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

describe('Get product', () => {
  let inMemoryProductImagesRepository: InMemoryProductImagesRepository
  let inMemoryProductsRepository: InMemoryProductsRepository
  let sut: GetProductUseCase

  beforeEach(() => {
    inMemoryProductImagesRepository = new InMemoryProductImagesRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemoryProductImagesRepository,
    )
    sut = new GetProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to get active product when is not admin', async () => {
    const product = makeProduct({
      status: ProductStatus.create('ACTIVE'),
    })

    inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      id: product.id.toString(),
      isAdmin: false,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryProductsRepository.items[0]).toEqual(product)
    }
  })

  it('should be able to get disabled product when is admin', async () => {
    const product = makeProduct({
      status: ProductStatus.create('DISABLED'),
    })

    inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      id: product.id.toString(),
      isAdmin: true,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryProductsRepository.items[0]).toEqual(product)
    }
  })

  it('should not be able to get disabled product when is not admin', async () => {
    const product = makeProduct({
      status: ProductStatus.create('DISABLED'),
    })

    inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      id: product.id.toString(),
      isAdmin: false,
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })
})

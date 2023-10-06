import { ActivateProductUseCase } from './activate-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { InMemoryProductImagesRepository } from 'test/repositories/in-memory-product-images-repository'
import { ProductStatus } from '../../enterprise/entities/value-objects/product-status'

describe('Activate product', () => {
  let inMemoryProductImagesRepository: InMemoryProductImagesRepository
  let inMemoryProductsRepository: InMemoryProductsRepository
  let sut: ActivateProductUseCase

  beforeEach(() => {
    inMemoryProductImagesRepository = new InMemoryProductImagesRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemoryProductImagesRepository,
    )
    sut = new ActivateProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to activate product', async () => {
    const product = makeProduct({
      status: ProductStatus.create('DISABLED'),
    })

    inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      productId: product.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryProductsRepository.items[0].isActive()).toBeTruthy()
    }
  })
})

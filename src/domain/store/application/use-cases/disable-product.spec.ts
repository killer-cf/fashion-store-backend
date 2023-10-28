import { DisableProductUseCase } from './disable-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { InMemoryProductImagesRepository } from 'test/repositories/in-memory-product-images-repository'
import { ProductStatus } from '../../enterprise/entities/value-objects/product-status'
import { InMemoryBrandsRepository } from 'test/repositories/in-memory-brands-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryProductCategoriesRepository } from 'test/repositories/in-memory-product-categories-repository'

describe('Disable product', () => {
  let inMemoryProductCategoriesRepository: InMemoryProductCategoriesRepository
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository
  let inMemoryProductImagesRepository: InMemoryProductImagesRepository
  let inMemoryProductsRepository: InMemoryProductsRepository
  let inMemoryBrandsRepository: InMemoryBrandsRepository
  let inMemoryImagesRepository: InMemoryImagesRepository
  let sut: DisableProductUseCase

  beforeEach(() => {
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
    sut = new DisableProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to disable product', async () => {
    const product = makeProduct({
      status: ProductStatus.create('ACTIVE'),
    })

    inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      productId: product.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryProductsRepository.items[0].isDisabled()).toBeTruthy()
    }
  })
})

import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { ListProductsUseCase } from './list-products'
import { makeProduct } from 'test/factories/make-product'
import { InMemoryProductImagesRepository } from 'test/repositories/in-memory-product-images-repository'
import { ProductStatus } from '../../enterprise/entities/value-objects/product-status'

describe('List Products', () => {
  let inMemoryProductImagesRepository: InMemoryProductImagesRepository
  let inMemoryProductsRepository: InMemoryProductsRepository
  let sut: ListProductsUseCase

  beforeEach(() => {
    inMemoryProductImagesRepository = new InMemoryProductImagesRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemoryProductImagesRepository,
    )
    sut = new ListProductsUseCase(inMemoryProductsRepository)
  })

  it('should be able to list active products when is not admin', async () => {
    inMemoryProductsRepository.create(makeProduct())
    inMemoryProductsRepository.create(makeProduct())
    inMemoryProductsRepository.create(
      makeProduct({
        name: 'Product Disabled',
        status: ProductStatus.create('DISABLED'),
      }),
    )

    const result = await sut.execute({
      page: 1,
      isAdmin: false,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toHaveLength(2)
  })

  it('should be able to list active and disabled products when is admin', async () => {
    inMemoryProductsRepository.create(makeProduct())
    inMemoryProductsRepository.create(makeProduct())
    inMemoryProductsRepository.create(
      makeProduct({
        name: 'Product Disabled',
        status: ProductStatus.create('DISABLED'),
      }),
    )

    const result = await sut.execute({
      page: 1,
      isAdmin: true,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toHaveLength(3)
  })

  it('should be able to list paginated products', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryProductsRepository.create(
        makeProduct({
          name: `Product ${i}`,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      isAdmin: false,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toHaveLength(2)
    expect(result.value?.products).toEqual([
      expect.objectContaining({ name: 'Product 21' }),
      expect.objectContaining({ name: 'Product 22' }),
    ])
  })
})

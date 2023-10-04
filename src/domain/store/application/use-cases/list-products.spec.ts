import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { ListProductsUseCase } from './list-products'
import { makeProduct } from 'test/factories/make-product'
import { InMemoryProductImagesRepository } from 'test/repositories/in-memory-product-images-repository'

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

  it('should be able to list products', async () => {
    inMemoryProductsRepository.create(makeProduct())
    inMemoryProductsRepository.create(makeProduct())

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductsRepository.items).toHaveLength(2)
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
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toHaveLength(2)
    expect(result.value?.products).toEqual([
      expect.objectContaining({ name: 'Product 21' }),
      expect.objectContaining({ name: 'Product 22' }),
    ])
  })
})

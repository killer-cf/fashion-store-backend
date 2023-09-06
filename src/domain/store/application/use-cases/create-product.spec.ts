import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { CreateProductUseCase } from './create-product'

describe('Create Product', () => {
  let inMemoryProductsRepository: InMemoryProductsRepository
  let sut: CreateProductUseCase

  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new CreateProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to create a product', async () => {
    const result = await sut.execute({
      brand: 'Xiaomi',
      color: 'green',
      model: '14T',
      name: 'Xiaomi 14T',
      sku: 'XI14TGR',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryProductsRepository.items[0]).toEqual(result.value?.product)
    }
  })
})

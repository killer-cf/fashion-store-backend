import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { CreateProductUseCase } from './create-product'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryBrandsRepository } from 'test/repositories/in-memory-brands-repository'
import { Brand } from '../../enterprise/entities/brand'

describe('Create Product', () => {
  let inMemoryProductsRepository: InMemoryProductsRepository
  let inMemoryAdminsRepository: InMemoryAdminsRepository
  let inMemoryBrandsRepository: InMemoryBrandsRepository
  let sut: CreateProductUseCase

  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryBrandsRepository = new InMemoryBrandsRepository()
    sut = new CreateProductUseCase(
      inMemoryProductsRepository,
      inMemoryAdminsRepository,
      inMemoryBrandsRepository,
    )
  })

  it('should be able to create a product', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.create(admin)

    const brand = Brand.create({ name: 'Xiaomi' })

    inMemoryBrandsRepository.create(brand)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      brand: 'Xiaomi',
      color: 'green',
      price: 200000,
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

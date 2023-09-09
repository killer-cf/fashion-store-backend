import { EditProductUseCase } from './edit-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { makeProduct } from 'test/factories/make-product'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

describe('Edit product', () => {
  let inMemoryProductsRepository: InMemoryProductsRepository
  let inMemoryAdminsRepository: InMemoryAdminsRepository
  let sut: EditProductUseCase

  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new EditProductUseCase(
      inMemoryProductsRepository,
      inMemoryAdminsRepository,
    )
  })

  it('should be able to edit product', async () => {
    const admin = makeAdmin()
    const product = makeProduct()

    inMemoryAdminsRepository.create(admin)
    inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      productId: product.id.toString(),
      name: 'Novo nome do produto',
      price: 1200,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryProductsRepository.items[0].name).toEqual(
        'Novo nome do produto',
      )
      expect(inMemoryProductsRepository.items[0].price).toEqual(1200)
    }
  })

  it.skip('should not be able to edit product if does not admin', async () => {
    const product = makeProduct()

    inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      adminId: 'id-nao-admin',
      productId: product.id.toString(),
      name: 'Novo nome do produto',
      price: 1200,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

import { EditProductUseCase } from './edit-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { makeProduct } from 'test/factories/make-product'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeProductImage } from 'test/factories/make-product-image'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryProductImagesRepository } from 'test/repositories/in-memory-product-images-repository'
import { InMemoryBrandsRepository } from 'test/repositories/in-memory-brands-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'

describe('Edit product', () => {
  let inMemoryProductImagesRepository: InMemoryProductImagesRepository
  let inMemoryProductsRepository: InMemoryProductsRepository
  let inMemoryAdminsRepository: InMemoryAdminsRepository
  let inMemoryBrandsRepository: InMemoryBrandsRepository
  let inMemoryImagesRepository: InMemoryImagesRepository
  let sut: EditProductUseCase

  beforeEach(() => {
    inMemoryProductImagesRepository = new InMemoryProductImagesRepository()
    inMemoryBrandsRepository = new InMemoryBrandsRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemoryProductImagesRepository,
      inMemoryBrandsRepository,
      inMemoryImagesRepository,
    )
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new EditProductUseCase(
      inMemoryProductsRepository,
      inMemoryAdminsRepository,
      inMemoryProductImagesRepository,
    )
  })

  it('should be able to edit product', async () => {
    const admin = makeAdmin()
    const product = makeProduct()

    inMemoryAdminsRepository.create(admin)
    inMemoryProductsRepository.create(product)

    inMemoryProductImagesRepository.items.push(
      makeProductImage({
        productId: product.id,
        imageId: new UniqueEntityID('1'),
      }),
      makeProductImage({
        productId: product.id,
        imageId: new UniqueEntityID('2'),
      }),
    )

    const result = await sut.execute({
      adminId: admin.id.toString(),
      productId: product.id.toString(),
      name: 'Novo nome do produto',
      description: 'nova descrição do produto',
      colors: ['green', 'blue'],
      price: 1200,
      imageIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryProductsRepository.items[0].name).toEqual(
        'Novo nome do produto',
      )
      expect(inMemoryProductsRepository.items[0].price).toEqual(1200)
      expect(inMemoryProductsRepository.items[0].colors).toEqual([
        'green',
        'blue',
      ])
      expect(inMemoryProductsRepository.items[0].description).toEqual(
        'nova descrição do produto',
      )
      expect(
        inMemoryProductsRepository.items[0].images.currentItems,
      ).toHaveLength(2)
      expect(inMemoryProductsRepository.items[0].images.currentItems).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ imageId: new UniqueEntityID('1') }),
          expect.objectContaining({ imageId: new UniqueEntityID('3') }),
        ]),
      )
    }
  })

  it('should not be able to edit product if does not admin', async () => {
    const product = makeProduct()

    inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      adminId: 'id-nao-admin',
      productId: product.id.toString(),
      name: 'Novo nome do produto',
      description: 'nova descrição do produto',
      colors: ['green', 'blue'],
      price: 1200,
      imageIds: ['1', '2'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should sync new and removed images when editing a product', async () => {
    const admin = makeAdmin()
    const product = makeProduct()

    inMemoryAdminsRepository.create(admin)
    inMemoryProductsRepository.create(product)

    inMemoryProductImagesRepository.items.push(
      makeProductImage({
        productId: product.id,
        imageId: new UniqueEntityID('1'),
      }),
      makeProductImage({
        productId: product.id,
        imageId: new UniqueEntityID('2'),
      }),
    )

    const result = await sut.execute({
      adminId: admin.id.toString(),
      productId: product.id.toString(),
      name: 'Novo nome do produto',
      description: 'nova descrição do produto',
      colors: ['green', 'blue'],
      price: 1200,
      imageIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryProductImagesRepository.items).toHaveLength(2)
      expect(inMemoryProductImagesRepository.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ imageId: new UniqueEntityID('1') }),
          expect.objectContaining({ imageId: new UniqueEntityID('3') }),
        ]),
      )
    }
  })
})

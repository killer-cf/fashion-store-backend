import { EditProductUseCase } from './edit-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { makeProductImage } from 'test/factories/make-product-image'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryProductImagesRepository } from 'test/repositories/in-memory-product-images-repository'
import { InMemoryBrandsRepository } from 'test/repositories/in-memory-brands-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryProductCategoriesRepository } from 'test/repositories/in-memory-product-categories-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { makeProductCategory } from 'test/factories/make-product-category'

describe('Edit product', () => {
  let inMemoryProductCategoriesRepository: InMemoryProductCategoriesRepository
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository
  let inMemoryProductImagesRepository: InMemoryProductImagesRepository
  let inMemoryProductsRepository: InMemoryProductsRepository
  let inMemoryBrandsRepository: InMemoryBrandsRepository
  let inMemoryImagesRepository: InMemoryImagesRepository
  let sut: EditProductUseCase

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
    sut = new EditProductUseCase(
      inMemoryProductsRepository,
      inMemoryProductImagesRepository,
      inMemoryProductCategoriesRepository,
    )
  })

  it('should be able to edit product', async () => {
    const product = makeProduct()

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

    inMemoryProductCategoriesRepository.items.push(
      makeProductCategory({
        productId: product.id,
        categoryId: new UniqueEntityID('1'),
      }),
      makeProductCategory({
        productId: product.id,
        categoryId: new UniqueEntityID('2'),
      }),
    )

    const result = await sut.execute({
      productId: product.id.toString(),
      name: 'Novo nome do produto',
      description: 'nova descrição do produto',
      colors: ['green', 'blue'],
      price: 1200,
      imageIds: ['1', '3'],
      categoriesIds: ['1', '3'],
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
      expect(
        inMemoryProductsRepository.items[0].categories.currentItems,
      ).toHaveLength(2)
      expect(
        inMemoryProductsRepository.items[0].categories.currentItems,
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ categoryId: new UniqueEntityID('1') }),
          expect.objectContaining({ categoryId: new UniqueEntityID('3') }),
        ]),
      )
    }
  })

  it('should sync new and removed images when editing a product', async () => {
    const product = makeProduct()

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
      productId: product.id.toString(),
      name: 'Novo nome do produto',
      description: 'nova descrição do produto',
      colors: ['green', 'blue'],
      price: 1200,
      imageIds: ['1', '3'],
      categoriesIds: ['1', '3'],
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

      expect(inMemoryProductCategoriesRepository.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ categoryId: new UniqueEntityID('1') }),
          expect.objectContaining({ categoryId: new UniqueEntityID('3') }),
        ]),
      )
    }
  })
})

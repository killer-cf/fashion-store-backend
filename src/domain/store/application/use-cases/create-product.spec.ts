import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { CreateProductUseCase } from './create-product'
import { InMemoryBrandsRepository } from 'test/repositories/in-memory-brands-repository'
import { Brand } from '../../enterprise/entities/brand'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryProductImagesRepository } from 'test/repositories/in-memory-product-images-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryProductCategoriesRepository } from 'test/repositories/in-memory-product-categories-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'

describe('Create Product', () => {
  let inMemoryProductCategoriesRepository: InMemoryProductCategoriesRepository
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository
  let inMemoryProductImagesRepository: InMemoryProductImagesRepository
  let inMemoryProductsRepository: InMemoryProductsRepository
  let inMemoryBrandsRepository: InMemoryBrandsRepository
  let inMemoryImagesRepository: InMemoryImagesRepository
  let sut: CreateProductUseCase

  beforeEach(() => {
    inMemoryProductCategoriesRepository =
      new InMemoryProductCategoriesRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryBrandsRepository = new InMemoryBrandsRepository()
    inMemoryProductImagesRepository = new InMemoryProductImagesRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemoryProductImagesRepository,
      inMemoryBrandsRepository,
      inMemoryImagesRepository,
      inMemoryProductCategoriesRepository,
      inMemoryCategoriesRepository,
    )
    sut = new CreateProductUseCase(
      inMemoryProductsRepository,
      inMemoryBrandsRepository,
    )
  })

  it('should be able to create a product', async () => {
    const brand = Brand.create({ name: 'Xiaomi' })

    inMemoryBrandsRepository.create(brand)

    const result = await sut.execute({
      brandName: 'Xiaomi',
      description: 'the best smartphone',
      colors: ['green', 'black'],
      price: 200000,
      status: 'DISABLED',
      model: '14T',
      name: 'Xiaomi 14T',
      sku: 'XI14TGR',
      imageIds: ['1', '2'],
      categoriesIds: ['10', '11'],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryProductsRepository.items[0]).toEqual(result.value?.product)
      expect(inMemoryProductsRepository.items[0].brandId).toEqual(brand.id)
      expect(inMemoryProductsRepository.items[0].images.currentItems).toEqual([
        expect.objectContaining({ imageId: new UniqueEntityID('1') }),
        expect.objectContaining({ imageId: new UniqueEntityID('2') }),
      ])
      expect(
        inMemoryProductsRepository.items[0].categories.currentItems,
      ).toEqual([
        expect.objectContaining({ categoryId: new UniqueEntityID('10') }),
        expect.objectContaining({ categoryId: new UniqueEntityID('11') }),
      ])
    }
  })

  test('should persist images when create a new product', async () => {
    const brand = Brand.create({ name: 'Xiaomi' })

    inMemoryBrandsRepository.create(brand)

    const result = await sut.execute({
      brandName: brand.name,
      description: 'the best smartphone',
      colors: ['green', 'black'],
      price: 200000,
      model: '14T',
      status: 'DISABLED',
      name: 'Xiaomi 14T',
      sku: 'XI14TGR',
      imageIds: ['1', '2'],
      categoriesIds: ['10', '11'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductImagesRepository.items).toHaveLength(2)
    expect(inMemoryProductImagesRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          imageId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          imageId: new UniqueEntityID('2'),
        }),
      ]),
    )
    expect(inMemoryProductCategoriesRepository.items).toHaveLength(2)
    expect(inMemoryProductCategoriesRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          categoryId: new UniqueEntityID('10'),
        }),
        expect.objectContaining({
          categoryId: new UniqueEntityID('11'),
        }),
      ]),
    )
  })
})

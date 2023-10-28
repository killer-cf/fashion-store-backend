import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { InMemoryProductImagesRepository } from 'test/repositories/in-memory-product-images-repository'
import { InMemoryBrandsRepository } from 'test/repositories/in-memory-brands-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryProductCategoriesRepository } from 'test/repositories/in-memory-product-categories-repository'
import { ListProductsByCategoryUseCase } from './list-products-by-category'
import { ProductCategoryList } from '../../enterprise/entities/product-category-list'
import { makeProductCategory } from 'test/factories/make-product-category'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

describe('List Products by category', () => {
  let inMemoryProductCategoriesRepository: InMemoryProductCategoriesRepository
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository
  let inMemoryProductImagesRepository: InMemoryProductImagesRepository
  let inMemoryProductsRepository: InMemoryProductsRepository
  let inMemoryBrandsRepository: InMemoryBrandsRepository
  let inMemoryImagesRepository: InMemoryImagesRepository
  let sut: ListProductsByCategoryUseCase

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
    sut = new ListProductsByCategoryUseCase(inMemoryProductsRepository)
  })

  it.only('should be able to list products by category and search', async () => {
    const productCategory = makeProductCategory({
      categoryId: new UniqueEntityID('1'),
    })
    const productCategory2 = makeProductCategory({
      categoryId: new UniqueEntityID('2'),
    })
    const productCategory3 = makeProductCategory({
      categoryId: new UniqueEntityID('3'),
    })

    inMemoryProductsRepository.create(
      makeProduct({
        name: 'Celular xiaomi 11',
        categories: new ProductCategoryList([
          productCategory,
          productCategory2,
          productCategory3,
        ]),
      }),
    )
    inMemoryProductsRepository.create(
      makeProduct({
        name: 'Notebook lenovo gaming 3i',
        categories: new ProductCategoryList([
          productCategory,
          productCategory3,
        ]),
      }),
    )
    inMemoryProductsRepository.create(
      makeProduct({
        name: 'Celular xiaomi 9',
        categories: new ProductCategoryList([productCategory]),
      }),
    )

    const result = await sut.execute({
      page: 1,
      categoryId: '1',
      search: 'xiaomi',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toHaveLength(2)
    expect(result.value?.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Celular xiaomi 9',
        }),
        expect.objectContaining({
          name: 'Celular xiaomi 11',
        }),
      ]),
    )
  })
})

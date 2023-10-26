import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { ListCategoriesUseCase } from './list-categories'
import { makeCategory } from 'test/factories/make-category'
import { InMemorySubCategoriesRepository } from 'test/repositories/in-memory-sub-categories-repository'

describe('List Categories', () => {
  let inMemorySubCategoriesRepository: InMemorySubCategoriesRepository
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository
  let sut: ListCategoriesUseCase

  beforeEach(() => {
    inMemorySubCategoriesRepository = new InMemorySubCategoriesRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository(
      inMemorySubCategoriesRepository,
    )
    sut = new ListCategoriesUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to list categories', async () => {
    const category1 = makeCategory()
    const category2 = makeCategory()

    const subCategory1 = makeCategory({
      parentCategoryId: category1.id,
    })

    const subCategory2 = makeCategory({
      parentCategoryId: category1.id,
    })

    const subCategory3 = makeCategory({
      parentCategoryId: category2.id,
    })

    inMemoryCategoriesRepository.create(category1)
    inMemoryCategoriesRepository.create(category2)
    inMemoryCategoriesRepository.create(subCategory1)
    inMemoryCategoriesRepository.create(subCategory2)
    inMemoryCategoriesRepository.create(subCategory3)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(inMemoryCategoriesRepository.items).toHaveLength(5)
    expect(result.value?.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: category1.name,
          subCategories: expect.arrayContaining([
            expect.objectContaining({
              name: subCategory1.name,
            }),
            expect.objectContaining({
              name: subCategory2.name,
            }),
          ]),
        }),
        expect.objectContaining({
          name: category2.name,
          subCategories: expect.arrayContaining([
            expect.objectContaining({
              name: subCategory3.name,
            }),
          ]),
        }),
      ]),
    )
  })
})

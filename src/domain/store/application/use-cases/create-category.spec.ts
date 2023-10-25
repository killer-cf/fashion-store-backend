import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { CreateCategoryUseCase } from './create-category'
import { InMemorySubCategoriesRepository } from 'test/repositories/in-memory-sub-categories-repository'

describe('Create Category', () => {
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository
  let inMemorySubCategoriesRepository: InMemorySubCategoriesRepository
  let sut: CreateCategoryUseCase

  beforeEach(() => {
    inMemorySubCategoriesRepository = new InMemorySubCategoriesRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository(
      inMemorySubCategoriesRepository,
    )
    sut = new CreateCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to create a category', async () => {
    const result = await sut.execute({
      name: 'Computadores',
      subCategoriesIds: [],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryCategoriesRepository.items[0]).toEqual(
        result.value?.category,
      )
    }
  })
})

import { DeleteCategoryUseCase } from './delete-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { makeCategory } from 'test/factories/make-category'

describe('Delete category', () => {
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository
  let sut: DeleteCategoryUseCase

  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new DeleteCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to delete category', async () => {
    const category = makeCategory()

    inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      id: category.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryCategoriesRepository.items).toHaveLength(0)
    }
  })
})

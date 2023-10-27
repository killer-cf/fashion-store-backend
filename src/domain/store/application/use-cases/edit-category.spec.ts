import { EditCategoryUseCase } from './edit-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { makeCategory } from 'test/factories/make-category'

describe('Edit category', () => {
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository
  let sut: EditCategoryUseCase

  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new EditCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to edit category', async () => {
    const category = makeCategory({
      name: 'Notebooks',
    })

    inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      categoryId: category.id.toString(),
      name: 'Computadores',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryCategoriesRepository.items[0].name).toEqual('Computadores')
    }
  })
})

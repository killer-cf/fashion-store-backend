import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { ListCategoriesUseCase } from './list-categories'
import { makeCategory } from 'test/factories/make-category'

describe('List Categories', () => {
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository
  let sut: ListCategoriesUseCase

  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new ListCategoriesUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to list categories', async () => {
    const category1 = makeCategory()
    const category2 = makeCategory()

    inMemoryCategoriesRepository.create(category1)
    inMemoryCategoriesRepository.create(category2)

    const result = await sut.execute({ page: 1 })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCategoriesRepository.items).toHaveLength(2)
  })
})

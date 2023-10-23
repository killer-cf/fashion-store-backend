import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { CreateCategoryUseCase } from './create-category'
import { Category } from '../../enterprise/entities/category'

describe('Create Category', () => {
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository
  let sut: CreateCategoryUseCase

  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new CreateCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to create a category', async () => {
    const result = await sut.execute({
      name: 'Computadores',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryCategoriesRepository.items[0]).toEqual(
        result.value?.category,
      )
    }
  })

  it('should be able to create a sub-category', async () => {
    const category = Category.create({ name: 'Computadores' })
    inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      name: 'Notebooks',
      parentCategoryId: category.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryCategoriesRepository.items[1]).toEqual(
        result.value?.category,
      )
      expect(inMemoryCategoriesRepository.items[0].name).toEqual('Computadores')
      expect(
        inMemoryCategoriesRepository.items[0].subCategories.getItems(),
      ).toEqual([
        expect.objectContaining({
          subCategoryId: result.value.category.id,
          parentCategoryId: category.id,
        }),
      ])
    }
  })
})

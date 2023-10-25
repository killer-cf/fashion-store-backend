import { EditCategoryUseCase } from './edit-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { makeCategory } from 'test/factories/make-category'
import { InMemorySubCategoriesRepository } from 'test/repositories/in-memory-sub-categories-repository'
import { makeSubCategory } from 'test/factories/make-sub-category'

describe('Edit category', () => {
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository
  let inMemorySubCategoriesRepository: InMemorySubCategoriesRepository
  let sut: EditCategoryUseCase

  beforeEach(() => {
    inMemorySubCategoriesRepository = new InMemorySubCategoriesRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository(
      inMemorySubCategoriesRepository,
    )
    sut = new EditCategoryUseCase(
      inMemoryCategoriesRepository,
      inMemorySubCategoriesRepository,
    )
  })

  it('should be able to edit category', async () => {
    const category = makeCategory({
      name: 'Notebooks',
    })

    inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      categoryId: category.id.toString(),
      name: 'Computadores',
      subCategoriesIds: [],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryCategoriesRepository.items[0].name).toEqual('Computadores')
    }
  })

  it('should sync new and removed sub-categories when editing a product', async () => {
    const category = makeCategory({
      name: 'Computadores',
    })

    const subCategory1 = makeCategory({
      name: 'Notebooks',
      parentCategoryId: category.id,
    })

    const sub = makeSubCategory({
      parentCategoryId: category.id,
      subCategoryId: subCategory1.id,
    })

    inMemorySubCategoriesRepository.items.push(sub)

    inMemoryCategoriesRepository.create(category)

    const subCategory2 = makeCategory({
      name: 'Notebooks',
      parentCategoryId: category.id,
    })

    const sub2 = makeSubCategory({
      parentCategoryId: category.id,
      subCategoryId: subCategory2.id,
    })

    inMemorySubCategoriesRepository.items.push(sub2)

    const result = await sut.execute({
      categoryId: category.id.toString(),
      name: 'Computadores',
      subCategoriesIds: [sub2.id.toString()],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemorySubCategoriesRepository.items).toHaveLength(1)
      expect(inMemorySubCategoriesRepository.items).toEqual([
        expect.objectContaining({ parentCategoryId: category.id }),
      ])
    }
  })
})

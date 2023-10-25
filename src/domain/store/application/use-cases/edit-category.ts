import { Either, left, right } from '@/core/either'
import { Category } from '../../enterprise/entities/category'
import { CategoriesRepository } from '../repositories/categories-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SubCategoriesRepository } from '../repositories/sub-categories-repository'
import { SubCategoryList } from '../../enterprise/entities/sub-category-list'
import { SubCategory } from '../../enterprise/entities/sub-category'

interface EditCategoryUseCaseRequest {
  categoryId: string
  name: string
  parentCategoryId?: string
  subCategoriesIds: string[]
}

type EditCategoryUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    category: Category
  }
>

export class EditCategoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private subCategoriesRepository: SubCategoriesRepository,
  ) {}

  async execute({
    categoryId,
    name,
    parentCategoryId,
    subCategoriesIds,
  }: EditCategoryUseCaseRequest): Promise<EditCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    const currentSubCategories =
      await this.subCategoriesRepository.findManyByCategoryId(categoryId)

    const subCategoriesList = new SubCategoryList(currentSubCategories)

    const subCategories = subCategoriesIds.map((subCategoryId) => {
      return SubCategory.create({
        parentCategoryId: category.id,
        subCategoryId: new UniqueEntityID(subCategoryId),
      })
    })

    subCategoriesList.update(subCategories)

    category.name = name
    category.parentCategoryId = parentCategoryId
      ? new UniqueEntityID(parentCategoryId)
      : undefined
    category.subCategories = subCategoriesList

    await this.categoriesRepository.save(category)

    return right({ category })
  }
}

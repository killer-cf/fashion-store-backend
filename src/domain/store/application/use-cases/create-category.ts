import { Either, right } from '@/core/either'
import { Category } from '../../enterprise/entities/category'
import { CategoriesRepository } from '../repositories/categories-repository'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SubCategory } from '../../enterprise/entities/sub-category'
import { SubCategoryList } from '../../enterprise/entities/sub-category-list'

interface CreateCategoryUseCaseRequest {
  name: string
  parentCategoryId?: string
  subCategoriesIds: string[]
}

type CreateCategoryUseCaseResponse = Either<
  null,
  {
    category: Category
  }
>

@Injectable()
export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    name,
    parentCategoryId,
    subCategoriesIds,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const category = Category.create({
      name,
      parentCategoryId: parentCategoryId
        ? new UniqueEntityID(parentCategoryId)
        : undefined,
    })

    const subcategories = subCategoriesIds.map((sub) => {
      return SubCategory.create({
        parentCategoryId: category.id,
        subCategoryId: new UniqueEntityID(sub),
      })
    })

    category.subCategories = new SubCategoryList(subcategories)

    await this.categoriesRepository.create(category)

    return right({ category })
  }
}

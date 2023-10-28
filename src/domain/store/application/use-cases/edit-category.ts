import { Either, left, right } from '@/core/either'
import { Category } from '../../enterprise/entities/category'
import { CategoriesRepository } from '../repositories/categories-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface EditCategoryUseCaseRequest {
  categoryId: string
  name: string
}

type EditCategoryUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    category: Category
  }
>

@Injectable()
export class EditCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    categoryId,
    name,
  }: EditCategoryUseCaseRequest): Promise<EditCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    category.name = name

    await this.categoriesRepository.save(category)

    return right({ category })
  }
}

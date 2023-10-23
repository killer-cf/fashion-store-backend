import { Either, right } from '@/core/either'
import { Category } from '../../enterprise/entities/category'
import { CategoriesRepository } from '../repositories/categories-repository'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateCategoryUseCaseRequest {
  name: string
  parentCategoryId?: string
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
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const category = Category.create({
      name,
      parentCategoryId: parentCategoryId
        ? new UniqueEntityID(parentCategoryId)
        : undefined,
    })

    await this.categoriesRepository.create(category)

    return right({ category })
  }
}

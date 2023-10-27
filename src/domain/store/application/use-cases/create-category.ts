import { Either, right } from '@/core/either'
import { Category } from '../../enterprise/entities/category'
import { CategoriesRepository } from '../repositories/categories-repository'
import { Injectable } from '@nestjs/common'

interface CreateCategoryUseCaseRequest {
  name: string
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
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const category = Category.create({
      name,
    })

    await this.categoriesRepository.create(category)

    return right({ category })
  }
}

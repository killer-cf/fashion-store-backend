import { Either, right } from '@/core/either'
import { CategoriesRepository } from '../repositories/categories-repository'
import { Injectable } from '@nestjs/common'
import { CategoryWithSubCategories } from '../../enterprise/entities/value-objects/category-with-sub-categories'

type ListCategoriesUseCaseResponse = Either<
  null,
  {
    categories: CategoryWithSubCategories[]
  }
>

@Injectable()
export class ListCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(): Promise<ListCategoriesUseCaseResponse> {
    const categories =
      await this.categoriesRepository.findManyWithSubCategories()

    return right({ categories })
  }
}

import { Either, right } from '@/core/either'
import { CategoriesRepository } from '../repositories/categories-repository'
import { Injectable } from '@nestjs/common'
import { Category } from '../../enterprise/entities/category'

interface ListCategoriesUseCaseRequest {
  page: number
}

type ListCategoriesUseCaseResponse = Either<
  null,
  {
    categories: Category[]
  }
>

@Injectable()
export class ListCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    page,
  }: ListCategoriesUseCaseRequest): Promise<ListCategoriesUseCaseResponse> {
    const categories = await this.categoriesRepository.findMany(page)

    return right({ categories })
  }
}

import { Either, left, right } from '@/core/either'
import { CategoriesRepository } from '../repositories/categories-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface DeleteCategoryUseCaseRequest {
  id: string
}

type DeleteCategoryUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    id,
  }: DeleteCategoryUseCaseRequest): Promise<DeleteCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.findById(id)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    await this.categoriesRepository.delete(category)

    return right(null)
  }
}

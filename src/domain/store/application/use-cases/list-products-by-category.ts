import { Either, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { Injectable } from '@nestjs/common'

interface ListProductsByCategoryUseCaseRequest {
  page: number
  categoryId: string
  search: string
}

type ListProductsByCategoryUseCaseResponse = Either<
  null,
  {
    products: Product[]
  }
>

@Injectable()
export class ListProductsByCategoryUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    page,
    categoryId,
    search = '',
  }: ListProductsByCategoryUseCaseRequest): Promise<ListProductsByCategoryUseCaseResponse> {
    const products = await this.productsRepository.findManyByCategoryId({
      page,
      categoryId,
      search,
    })

    return right({ products })
  }
}

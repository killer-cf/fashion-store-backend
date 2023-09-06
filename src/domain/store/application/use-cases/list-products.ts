import { Either, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'

interface ListProductsUseCaseRequest {
  page: number
}

type ListProductsUseCaseResponse = Either<
  null,
  {
    products: Product[]
  }
>

export class ListProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    page,
  }: ListProductsUseCaseRequest): Promise<ListProductsUseCaseResponse> {
    const products = await this.productsRepository.listAll(page)

    return right({ products })
  }
}

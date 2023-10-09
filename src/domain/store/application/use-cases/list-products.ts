import { Either, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { Injectable } from '@nestjs/common'

interface ListProductsUseCaseRequest {
  page: number
  isAdmin: boolean
}

type ListProductsUseCaseResponse = Either<
  null,
  {
    products: Product[]
  }
>

@Injectable()
export class ListProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    page,
    isAdmin,
  }: ListProductsUseCaseRequest): Promise<ListProductsUseCaseResponse> {
    const products = isAdmin
      ? await this.productsRepository.listAll(page)
      : await this.productsRepository.listAllActive(page)

    return right({ products })
  }
}

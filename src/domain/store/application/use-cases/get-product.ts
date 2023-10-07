import { Either, left, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface GetProductUseCaseRequest {
  id: string
  isAdmin: boolean
}

type GetProductUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: Product
  }
>

@Injectable()
export class GetProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    id,
    isAdmin,
  }: GetProductUseCaseRequest): Promise<GetProductUseCaseResponse> {
    const product = await this.productsRepository.findById(id)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    if (product.isDisabled() && !isAdmin) {
      return left(new ResourceNotFoundError())
    }

    return right({ product })
  }
}

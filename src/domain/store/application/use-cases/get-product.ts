import { Either, left, right } from '@/core/either'
import { ProductsRepository } from '../repositories/products-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { ProductDetails } from '../../enterprise/entities/value-objects/product-details'

interface GetProductUseCaseRequest {
  id: string
  isAdmin: boolean
}

type GetProductUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: ProductDetails
  }
>

@Injectable()
export class GetProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    id,
    isAdmin,
  }: GetProductUseCaseRequest): Promise<GetProductUseCaseResponse> {
    const product = await this.productsRepository.findDetailsById(id)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    if (product.isDisabled() && !isAdmin) {
      return left(new ResourceNotFoundError())
    }

    return right({ product })
  }
}

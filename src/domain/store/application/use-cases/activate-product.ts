import { Either, left, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ProductAlreadyActivatedError } from './errors/product-already-activated-error'
import { Injectable } from '@nestjs/common'

interface ActivateProductUseCaseRequest {
  productId: string
}

type ActivateProductUseCaseResponse = Either<
  ResourceNotFoundError | ProductAlreadyActivatedError,
  {
    product: Product
  }
>

@Injectable()
export class ActivateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
  }: ActivateProductUseCaseRequest): Promise<ActivateProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    if (product.isActive()) {
      return left(new ProductAlreadyActivatedError())
    }

    product.activate()

    await this.productsRepository.save(product)

    return right({ product })
  }
}

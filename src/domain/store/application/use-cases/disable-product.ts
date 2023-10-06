import { Either, left, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ProductAlreadyDisabledError } from './errors/product-already-disabled-error'
import { Injectable } from '@nestjs/common'

interface DisableProductUseCaseRequest {
  productId: string
}

type DisableProductUseCaseResponse = Either<
  ResourceNotFoundError | ProductAlreadyDisabledError,
  {
    product: Product
  }
>

@Injectable()
export class DisableProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
  }: DisableProductUseCaseRequest): Promise<DisableProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    if (product.isDisabled()) {
      return left(new ProductAlreadyDisabledError())
    }

    product.disable()

    await this.productsRepository.save(product)

    return right({ product })
  }
}

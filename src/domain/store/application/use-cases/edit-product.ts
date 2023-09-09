import { Either, left, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface EditProductUseCaseRequest {
  productId: string
  name: string
  price: number
}

type EditProductUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: Product
  }
>

export class EditProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    name,
    price,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    product.name = name
    product.price = price

    await this.productsRepository.save(product)

    return right({ product })
  }
}

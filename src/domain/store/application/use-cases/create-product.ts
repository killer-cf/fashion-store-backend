import { Either, left, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { ProductAlreadyExistsError } from './errors/product-already-exists-error'

interface CreateProductUseCaseRequest {
  name: string
  sku: string
  brand: string
  model: string
  color: string
  quantity?: number
}

type CreateProductUseCaseResponse = Either<
  ProductAlreadyExistsError,
  {
    product: Product
  }
>

export class CreateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    name,
    quantity,
    sku,
    brand,
    model,
    color,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const productWithSameSku = await this.productsRepository.findBySKU(sku)

    if (productWithSameSku) {
      return left(new ProductAlreadyExistsError())
    }

    const product = Product.create({
      name,
      sku,
      quantity,
      brand,
      model,
      color,
    })

    this.productsRepository.create(product)

    return right({ product })
  }
}
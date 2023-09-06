import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'

interface CreateProductUseCaseRequest {
  name: string
  brand: string
  model: string
  color: string
  quantity?: number
}

interface CreateProductUseCaseResponse {
  product: Product
}

export class CreateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    name,
    quantity,
    brand,
    model,
    color,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = Product.create({
      name,
      quantity,
      brand,
      model,
      color,
    })

    this.productsRepository.create(product)

    return { product }
  }
}

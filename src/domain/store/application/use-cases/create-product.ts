import { Either, left, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { ProductAlreadyExistsError } from './errors/product-already-exists-error'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { BrandsRepository } from '../repositories/brands-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface CreateProductUseCaseRequest {
  name: string
  price: number
  sku: string
  brandName: string
  model: string
  color: string
  quantity?: number
}

type CreateProductUseCaseResponse = Either<
  ProductAlreadyExistsError | NotAllowedError | ResourceNotFoundError,
  {
    product: Product
  }
>

@Injectable()
export class CreateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private brandsRepository: BrandsRepository,
  ) {}

  async execute({
    name,
    price,
    quantity,
    sku,
    brandName,
    model,
    color,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const productWithSameSku = await this.productsRepository.findBySKU(sku)

    if (productWithSameSku) {
      return left(new ProductAlreadyExistsError())
    }

    const brandOnRepository = await this.brandsRepository.findByName(brandName)

    if (!brandOnRepository) {
      return left(new ResourceNotFoundError())
    }

    const product = Product.create({
      name,
      price,
      sku,
      quantity,
      model,
      color,
      brandId: brandOnRepository.id,
    })

    await this.productsRepository.create(product)

    return right({ product })
  }
}

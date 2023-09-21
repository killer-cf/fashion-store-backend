import { Either, left, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { ProductAlreadyExistsError } from './errors/product-already-exists-error'
import { Injectable } from '@nestjs/common'
import { AdminsRepository } from '../repositories/admins-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface CreateProductUseCaseRequest {
  adminId: string
  name: string
  price: number
  sku: string
  brand: string
  model: string
  color: string
  quantity?: number
}

type CreateProductUseCaseResponse = Either<
  ProductAlreadyExistsError | NotAllowedError,
  {
    product: Product
  }
>

@Injectable()
export class CreateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    name,
    price,
    quantity,
    sku,
    brand,
    model,
    color,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const admin = this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const productWithSameSku = await this.productsRepository.findBySKU(sku)

    if (productWithSameSku) {
      return left(new ProductAlreadyExistsError())
    }

    const product = Product.create({
      name,
      price,
      sku,
      quantity,
      brand,
      model,
      color,
    })

    await this.productsRepository.create(product)

    return right({ product })
  }
}

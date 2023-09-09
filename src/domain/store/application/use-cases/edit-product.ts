import { Either, left, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AdminsRepository } from '../repositories/admins-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface EditProductUseCaseRequest {
  adminId: string
  productId: string
  name: string
  price: number
}

type EditProductUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    product: Product
  }
>

export class EditProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    productId,
    name,
    price,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }

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

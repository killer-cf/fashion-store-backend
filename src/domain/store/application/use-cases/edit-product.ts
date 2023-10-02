import { Either, left, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AdminsRepository } from '../repositories/admins-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ProductImage } from '../../enterprise/entities/product-image'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductImageList } from '../../enterprise/entities/product-image-list'
import { ProductImagesRepository } from '../repositories/product-images-repository'

interface EditProductUseCaseRequest {
  adminId: string
  productId: string
  name: string
  price: number
  imageIds: string[]
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
    private productImagesRepository: ProductImagesRepository,
  ) {}

  async execute({
    adminId,
    productId,
    name,
    price,
    imageIds,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    const currentProductImages =
      await this.productImagesRepository.findManyByProductId(
        product.id.toString(),
      )

    const productImageList = new ProductImageList(currentProductImages)

    const productImages = imageIds.map((imageId) => {
      return ProductImage.create({
        productId: product.id,
        imageId: new UniqueEntityID(imageId),
      })
    })

    productImageList.update(productImages)

    product.images = productImageList
    product.name = name
    product.price = price

    await this.productsRepository.save(product)

    return right({ product })
  }
}

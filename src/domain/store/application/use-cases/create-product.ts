import { Either, left, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { ProductAlreadyExistsError } from './errors/product-already-exists-error'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { BrandsRepository } from '../repositories/brands-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ProductImage } from '../../enterprise/entities/product-image'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductImageList } from '../../enterprise/entities/product-image-list'
import { ProductStatus } from '../../enterprise/entities/value-objects/product-status'
import { ProductCategory } from '../../enterprise/entities/product-category'
import { ProductCategoryList } from '../../enterprise/entities/product-category-list'

interface CreateProductUseCaseRequest {
  name: string
  description: string
  price: number
  sku: string
  brandName: string
  model: string
  colors: string[]
  status: 'ACTIVE' | 'DISABLED'
  imageIds: string[]
  categoriesIds: string[]
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
    description,
    price,
    sku,
    brandName,
    model,
    colors,
    status,
    imageIds,
    categoriesIds,
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
      description,
      price,
      sku,
      model,
      colors,
      status: ProductStatus.create(status),
      brandId: brandOnRepository.id,
    })

    const productImages = imageIds.map((imageId) => {
      return ProductImage.create({
        productId: product.id,
        imageId: new UniqueEntityID(imageId),
      })
    })

    product.images = new ProductImageList(productImages)

    const productCategories = categoriesIds.map((categoryId) => {
      return ProductCategory.create({
        productId: product.id,
        categoryId: new UniqueEntityID(categoryId),
      })
    })

    product.categories = new ProductCategoryList(productCategories)

    await this.productsRepository.create(product)

    return right({ product })
  }
}

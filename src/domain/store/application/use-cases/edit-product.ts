import { Either, left, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductsRepository } from '../repositories/products-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ProductImage } from '../../enterprise/entities/product-image'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductImageList } from '../../enterprise/entities/product-image-list'
import { ProductImagesRepository } from '../repositories/product-images-repository'
import { ProductCategoriesRepository } from '../repositories/product-categories-repository'
import { ProductCategoryList } from '../../enterprise/entities/product-category-list'
import { ProductCategory } from '../../enterprise/entities/product-category'
import { Injectable } from '@nestjs/common'

interface EditProductUseCaseRequest {
  productId: string
  name: string
  description: string
  colors: string[]
  price: number
  imageIds: string[]
  categoriesIds: string[]
}

type EditProductUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    product: Product
  }
>

@Injectable()
export class EditProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private productImagesRepository: ProductImagesRepository,
    private productCategoriesRepository: ProductCategoriesRepository,
  ) {}

  async execute({
    productId,
    name,
    description,
    colors,
    price,
    imageIds,
    categoriesIds,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
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

    const currentProductCategories =
      await this.productCategoriesRepository.findManyByProductId(
        product.id.toString(),
      )

    const productCategoryList = new ProductCategoryList(
      currentProductCategories,
    )

    const productCategories = categoriesIds.map((categoryId) => {
      return ProductCategory.create({
        productId: product.id,
        categoryId: new UniqueEntityID(categoryId),
      })
    })

    productCategoryList.update(productCategories)

    product.images = productImageList
    product.categories = productCategoryList

    product.name = name
    product.description = description
    product.colors = colors
    product.price = price

    await this.productsRepository.save(product)

    return right({ product })
  }
}

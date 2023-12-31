import {
  FindManyByCategoryProps,
  ProductsRepository,
} from '@/domain/store/application/repositories/products-repository'
import { Product } from '@/domain/store/enterprise/entities/product'
import { ProductDetails } from '@/domain/store/enterprise/entities/value-objects/product-details'
import { InMemoryBrandsRepository } from './in-memory-brands-repository'
import { InMemoryProductImagesRepository } from './in-memory-product-images-repository'
import { InMemoryImagesRepository } from './in-memory-images-repository'
import { InMemoryProductCategoriesRepository } from './in-memory-product-categories-repository'
import { InMemoryCategoriesRepository } from './in-memory-categories-repository'

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = []

  constructor(
    private productImagesRepository: InMemoryProductImagesRepository,
    private brandsRepository: InMemoryBrandsRepository,
    private imagesRepository: InMemoryImagesRepository,
    private productCategoriesRepository: InMemoryProductCategoriesRepository,
    private categoriesRepository: InMemoryCategoriesRepository,
  ) {}

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((product) => product.id.toString() === id)

    if (!product) {
      return null
    }

    return product
  }

  async findDetailsById(id: string): Promise<ProductDetails | null> {
    const product = this.items.find((product) => product.id.toString() === id)

    if (!product) {
      return null
    }

    const brand = this.brandsRepository.items.find(
      (brand) => brand.id === product.brandId,
    )

    if (!brand) {
      throw new Error(
        `Brand with id ${product.brandId.toString()} does not exist`,
      )
    }

    const productImages =
      await this.productImagesRepository.findManyByProductId(
        product.id.toString(),
      )

    const images = productImages.map((productImage) => {
      const image = this.imagesRepository.items.find((image) =>
        image.id.equals(productImage.imageId),
      )

      if (!image) {
        throw new Error(
          `Image with id ${productImage.id.toString()} does not exist`,
        )
      }

      return image
    })

    const productCategories =
      await this.productCategoriesRepository.findManyByProductId(
        product.id.toString(),
      )

    const categories = productCategories.map((productCategory) => {
      const category = this.categoriesRepository.items.find((category) =>
        category.id.equals(productCategory.categoryId),
      )

      if (!category) {
        throw new Error(
          `category with id ${productCategory.id.toString()} does not exist`,
        )
      }

      return category
    })

    const productDetails = ProductDetails.create({
      productId: product.id,
      brandId: product.brandId,
      brandName: brand.name,
      description: product.description,
      status: product.status,
      colors: product.colors,
      model: product.model,
      name: product.name,
      price: product.price,
      sku: product.sku,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      images,
      categories,
    })

    return productDetails
  }

  async findBySKU(sku: string): Promise<Product | null> {
    const product = this.items.find((product) => product.sku === sku)

    if (!product) {
      return null
    }

    return product
  }

  async listAll(page: number): Promise<Product[]> {
    const products = this.items.slice((page - 1) * 20, page * 20)

    return products
  }

  async listAllActive(page: number): Promise<Product[]> {
    const products = this.items
      .filter((product) => product.isActive() === true)
      .slice((page - 1) * 20, page * 20)

    return products
  }

  async findManyByCategoryId({
    page,
    search,
    categoryId,
  }: FindManyByCategoryProps): Promise<Product[]> {
    let products = this.items
      .filter((product) =>
        product.categories
          .getItems()
          .some((category) => category.categoryId.toString() === categoryId),
      )
      .filter((product) => product.isActive() === true)

    if (search.split('').length > 0) {
      products = products.filter((product) =>
        product.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      )
    }

    return products.slice((page - 1) * 20, page * 20)
  }

  async create(product: Product): Promise<void> {
    this.items.push(product)

    this.productImagesRepository.createMany(product.images.getItems())
    this.productCategoriesRepository.createMany(product.categories.getItems())
  }

  async save(product: Product): Promise<void> {
    const productIndex = this.items.findIndex((item) => item.id === product.id)

    this.items[productIndex] = product

    this.productImagesRepository.deleteMany(product.images.getRemovedItems())
    this.productImagesRepository.createMany(product.images.getNewItems())

    this.productCategoriesRepository.deleteMany(
      product.categories.getRemovedItems(),
    )
    this.productCategoriesRepository.createMany(
      product.categories.getNewItems(),
    )
  }
}

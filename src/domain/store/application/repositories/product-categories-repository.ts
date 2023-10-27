import { ProductCategory } from '../../enterprise/entities/product-category'

export abstract class ProductCategoriesRepository {
  abstract createMany(categories: ProductCategory[]): Promise<void>
  abstract deleteMany(categories: ProductCategory[]): Promise<void>

  abstract findManyByProductId(productId: string): Promise<ProductCategory[]>

  abstract deleteManyByProductId(productId: string): Promise<void>
}

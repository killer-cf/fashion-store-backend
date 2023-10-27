import { ProductCategory } from '../../enterprise/entities/product-category'

export abstract class ProductCategoriesRepository {
  abstract createMany(categories: ProductCategory[]): Promise<void>
  abstract deleteMany(categories: ProductCategory[]): Promise<void>

  abstract findManyByCategoryId(categoryId: string): Promise<ProductCategory[]>

  abstract deleteManyByCategoryId(categoryId: string): Promise<void>
}

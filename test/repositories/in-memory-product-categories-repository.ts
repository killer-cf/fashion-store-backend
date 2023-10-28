import { ProductCategoriesRepository } from '@/domain/store/application/repositories/product-categories-repository'
import { ProductCategory } from '@/domain/store/enterprise/entities/product-category'

export class InMemoryProductCategoriesRepository
  implements ProductCategoriesRepository
{
  public items: ProductCategory[] = []

  async createMany(categories: ProductCategory[]): Promise<void> {
    this.items.push(...categories)
  }

  async deleteMany(categories: ProductCategory[]): Promise<void> {
    const productCategories = this.items.filter((item) => {
      return !categories.some((category) => category.equals(item))
    })

    this.items = productCategories
  }

  async findManyByProductId(productId: string): Promise<ProductCategory[]> {
    const productCategories = this.items.filter(
      (item) => item.productId.toString() === productId,
    )

    return productCategories
  }

  async deleteManyByProductId(productId: string): Promise<void> {
    const productCategories = this.items.filter(
      (item) => item.productId.toString() !== productId,
    )

    this.items = productCategories
  }
}

import { SubCategoriesRepository } from '@/domain/store/application/repositories/sub-categories-repository'
import { SubCategory } from '@/domain/store/enterprise/entities/sub-category'

export class InMemorySubCategoriesRepository
  implements SubCategoriesRepository
{
  public items: SubCategory[] = []

  async createMany(categories: SubCategory[]): Promise<void> {
    this.items.push(...categories)
  }

  async deleteMany(categories: SubCategory[]): Promise<void> {
    const subCategories = this.items.filter((item) => {
      return !categories.some((category) => category.equals(item))
    })

    this.items = subCategories
  }

  async findManyByCategoryId(categoryId: string): Promise<SubCategory[]> {
    const subCategories = this.items.filter(
      (item) => item.parentCategoryId.toString() === categoryId,
    )

    return subCategories
  }

  async deleteManyByCategoryId(categoryId: string): Promise<void> {
    const subCategories = this.items.filter(
      (item) => item.parentCategoryId.toString() !== categoryId,
    )

    this.items = subCategories
  }
}

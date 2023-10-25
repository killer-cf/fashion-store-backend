import { CategoriesRepository } from '@/domain/store/application/repositories/categories-repository'
import { SubCategoriesRepository } from '@/domain/store/application/repositories/sub-categories-repository'
import { Category } from '@/domain/store/enterprise/entities/category'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = []

  constructor(private subCategoriesRepository: SubCategoriesRepository) {}

  async findById(id: string): Promise<Category | null> {
    const category = this.items.find(
      (category) => category.id.toString() === id,
    )

    if (!category) {
      return null
    }

    return category
  }

  async findMany(page: number): Promise<Category[]> {
    const categories = this.items.slice((page - 1) * 20, page * 20)

    return categories
  }

  async create(category: Category): Promise<void> {
    this.items.push(category)

    this.subCategoriesRepository.createMany(
      category.subCategories.getNewItems(),
    )
  }

  async save(category: Category): Promise<void> {
    const categoryIndex = this.items.findIndex(
      (item) => item.id === category.id,
    )

    this.items[categoryIndex] = category

    this.subCategoriesRepository.createMany(
      category.subCategories.getNewItems(),
    )
    this.subCategoriesRepository.deleteMany(
      category.subCategories.getRemovedItems(),
    )
  }

  async delete(category: Category) {
    const itemIndex = this.items.findIndex((item) => item.id === category.id)

    this.items.splice(itemIndex, 1)
  }
}

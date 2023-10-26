import { CategoriesRepository } from '@/domain/store/application/repositories/categories-repository'
import { SubCategoriesRepository } from '@/domain/store/application/repositories/sub-categories-repository'
import { Category } from '@/domain/store/enterprise/entities/category'
import { CategoryWithSubCategories } from '@/domain/store/enterprise/entities/value-objects/category-with-sub-categories'

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

  async findManyWithSubCategories(): Promise<CategoryWithSubCategories[]> {
    const categories = this.items.filter(
      (category) => !category.isSubCategory(),
    )
    console.log(categories)

    const categoriesWithSubCategories = categories.map((category) => {
      const subCategories: CategoryWithSubCategories[] = this.items
        .filter((item) => item.parentCategoryId?.equals(category.id))
        .map((sub) => {
          return CategoryWithSubCategories.create({
            id: sub.id,
            name: sub.name,
            subCategories: [],
          })
        })

      return CategoryWithSubCategories.create({
        id: category.id,
        name: category.name,
        subCategories,
      })
    })
    console.log(categoriesWithSubCategories)

    return categoriesWithSubCategories
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

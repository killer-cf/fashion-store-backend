import { CategoriesRepository } from '@/domain/store/application/repositories/categories-repository'
import { Category } from '@/domain/store/enterprise/entities/category'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = []

  async findMany(page: number): Promise<Category[]> {
    const categories = this.items.slice((page - 1) * 20, page * 20)

    return categories
  }

  async create(category: Category): Promise<void> {
    this.items.push(category)
  }
}

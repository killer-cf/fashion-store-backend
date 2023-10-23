import { Category } from '../../enterprise/entities/category'

export abstract class CategoriesRepository {
  abstract findMany(page: number): Promise<Category[]>
  abstract create(category: Category): Promise<void>
}

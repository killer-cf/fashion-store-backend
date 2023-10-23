import { Category } from '../../enterprise/entities/category'

export abstract class CategoriesRepository {
  abstract findById(id: string): Promise<Category | null>
  abstract findMany(page: number): Promise<Category[]>
  abstract create(category: Category): Promise<void>
  abstract save(category: Category): Promise<void>
}

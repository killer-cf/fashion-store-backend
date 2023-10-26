import { Category } from '../../enterprise/entities/category'
import { CategoryWithSubCategories } from '../../enterprise/entities/value-objects/category-with-sub-categories'

export abstract class CategoriesRepository {
  abstract findById(id: string): Promise<Category | null>
  abstract findMany(page: number): Promise<Category[]>
  abstract findManyWithSubCategories(): Promise<CategoryWithSubCategories[]>
  abstract create(category: Category): Promise<void>
  abstract delete(category: Category): Promise<void>
  abstract save(category: Category): Promise<void>
}

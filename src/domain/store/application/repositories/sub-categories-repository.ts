import { SubCategory } from '../../enterprise/entities/sub-category'

export abstract class SubCategoriesRepository {
  abstract createMany(categories: SubCategory[]): Promise<void>
  abstract deleteMany(categories: SubCategory[]): Promise<void>

  abstract findManyByCategoryId(categoryId: string): Promise<SubCategory[]>

  abstract deleteManyByCategoryId(categoryId: string): Promise<void>
}

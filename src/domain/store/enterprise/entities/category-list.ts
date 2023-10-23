import { WatchedList } from '@/core/entities/watched-list'
import { Category } from './category'

export class CategoryList extends WatchedList<Category> {
  compareItems(a: Category, b: Category): boolean {
    return a.equals(b)
  }
}

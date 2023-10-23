import { WatchedList } from '@/core/entities/watched-list'
import { SubCategory } from './sub-category'

export class SubCategoryList extends WatchedList<SubCategory> {
  compareItems(a: SubCategory, b: SubCategory): boolean {
    return a.equals(b)
  }
}

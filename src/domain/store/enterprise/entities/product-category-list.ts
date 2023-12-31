import { WatchedList } from '@/core/entities/watched-list'
import { ProductCategory } from './product-category'

export class ProductCategoryList extends WatchedList<ProductCategory> {
  compareItems(a: ProductCategory, b: ProductCategory): boolean {
    return a.productId.equals(b.productId) && a.categoryId.equals(b.categoryId)
  }
}

import { Product } from '@/domain/store/enterprise/entities/product'

export class ProductPresenter {
  static toHTTP(product: Product) {
    return {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      brand: product.brand,
      model: product.model,
      color: product.color,
    }
  }
}

import { ProductsRepository } from '@/domain/store/application/repositories/products-repository'
import { Product } from '@/domain/store/enterprise/entities/product'

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = []

  async findBySKU(sku: string): Promise<Product | null> {
    const product = this.items.find((product) => product.sku === sku)

    if (!product) {
      return null
    }

    return product
  }

  async create(product: Product): Promise<void> {
    this.items.push(product)
  }
}

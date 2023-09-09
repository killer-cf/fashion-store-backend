import { ProductsRepository } from '@/domain/store/application/repositories/products-repository'
import { Product } from '@/domain/store/enterprise/entities/product'

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = []

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((product) => product.id.toString() === id)

    if (!product) {
      return null
    }

    return product
  }

  async findBySKU(sku: string): Promise<Product | null> {
    const product = this.items.find((product) => product.sku === sku)

    if (!product) {
      return null
    }

    return product
  }

  async listAll(page: number): Promise<Product[]> {
    const products = this.items.slice((page - 1) * 20, page * 20)

    return products
  }

  async create(product: Product): Promise<void> {
    this.items.push(product)
  }

  async save(product: Product): Promise<void> {
    const productIndex = this.items.findIndex((item) => item.id === product.id)

    this.items[productIndex] = product
  }
}

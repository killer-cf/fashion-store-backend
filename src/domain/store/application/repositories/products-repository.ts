import { Product } from '../../enterprise/entities/product'

export abstract class ProductsRepository {
  abstract findBySKU(sku: string): Promise<Product | null>
  abstract listAll(page: number): Promise<Product[]>
  abstract create(product: Product): Promise<void>
}

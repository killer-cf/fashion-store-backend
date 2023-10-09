import { Product } from '../../enterprise/entities/product'
import { ProductDetails } from '../../enterprise/entities/value-objects/product-details'

export abstract class ProductsRepository {
  abstract findBySKU(sku: string): Promise<Product | null>
  abstract findById(id: string): Promise<Product | null>
  abstract findDetailsById(id: string): Promise<ProductDetails | null>
  abstract listAll(page: number): Promise<Product[]>
  abstract listAllActive(page: number): Promise<Product[]>
  abstract create(product: Product): Promise<void>
  abstract save(product: Product): Promise<void>
}

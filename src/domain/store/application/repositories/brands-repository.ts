import { Brand } from '../../enterprise/entities/brand'

export abstract class BrandsRepository {
  abstract findByName(name: string): Promise<Brand | null>
  abstract create(brand: Brand): Promise<void>
}

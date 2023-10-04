import { Brand } from '../../enterprise/entities/brand'

export abstract class BrandsRepository {
  abstract findByName(name: string): Promise<Brand | null>
  abstract listAll(page: number): Promise<Brand[]>
  abstract create(brand: Brand): Promise<void>
}

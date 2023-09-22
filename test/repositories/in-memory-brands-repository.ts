import { BrandsRepository } from '@/domain/store/application/repositories/brands-repository'
import { Brand } from '@/domain/store/enterprise/entities/brand'

export class InMemoryBrandsRepository implements BrandsRepository {
  public items: Brand[] = []

  async findByName(name: string): Promise<Brand | null> {
    const brand = this.items.find((brand) => brand.name === name)

    if (!brand) {
      return null
    }

    return brand
  }

  async create(brand: Brand): Promise<void> {
    this.items.push(brand)
  }
}

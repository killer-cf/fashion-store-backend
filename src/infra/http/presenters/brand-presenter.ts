import { Brand } from '@/domain/store/enterprise/entities/brand'

export class BrandPresenter {
  static toHTTP(brand: Brand) {
    return {
      id: brand.id.toString(),
      name: brand.name,
    }
  }
}

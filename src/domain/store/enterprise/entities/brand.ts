import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface BrandProps {
  name: string
}

export class Brand extends Entity<BrandProps> {
  get name() {
    return this.props.name
  }

  static create(props: BrandProps, id?: UniqueEntityID) {
    const brand = new Brand(props, id)

    return brand
  }
}

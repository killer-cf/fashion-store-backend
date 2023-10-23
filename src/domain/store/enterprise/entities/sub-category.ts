import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface SubCategoryProps {
  parentCategoryId: UniqueEntityID
  subCategoryId: UniqueEntityID
}

export class SubCategory extends Entity<SubCategoryProps> {
  get parentCategoryId() {
    return this.props.parentCategoryId
  }

  get subCategoryId() {
    return this.props.subCategoryId
  }

  static create(props: SubCategoryProps, id?: UniqueEntityID) {
    const category = new SubCategory(props, id)

    return category
  }
}

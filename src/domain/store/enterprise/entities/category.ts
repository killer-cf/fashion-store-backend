import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CategoryProps {
  name: string
  parentCategoryId?: UniqueEntityID
}

export class Category extends Entity<CategoryProps> {
  get name() {
    return this.props.name
  }

  get parentCategoryId(): UniqueEntityID | undefined {
    return this.props.parentCategoryId
  }

  set parentCategoryId(id: UniqueEntityID) {
    this.props.parentCategoryId = id
  }

  static create(props: CategoryProps, id?: UniqueEntityID) {
    const category = new Category(props, id)

    return category
  }
}

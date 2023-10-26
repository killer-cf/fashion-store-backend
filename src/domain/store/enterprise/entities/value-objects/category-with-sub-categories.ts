import { ValueObject } from '@/core/entities/value-object'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export type CategoryWithSubCategoriesProps = {
  id: UniqueEntityID
  name: string
  // eslint-disable-next-line no-use-before-define
  subCategories: CategoryWithSubCategories[]
}

export class CategoryWithSubCategories extends ValueObject<CategoryWithSubCategoriesProps> {
  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get subCategories() {
    return this.props.subCategories
  }

  static create(props: CategoryWithSubCategoriesProps) {
    return new CategoryWithSubCategories(props)
  }
}

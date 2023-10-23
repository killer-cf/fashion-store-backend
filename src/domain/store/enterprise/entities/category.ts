import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CategoryList } from './category-list'
import { Optional } from '@/core/types/optional'

export interface CategoryProps {
  name: string
  parentCategoryId?: UniqueEntityID
  subCategories: CategoryList
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

  get subCategories() {
    return this.props.subCategories
  }

  public isSubCategory() {
    return !!this.props.parentCategoryId
  }

  static create(
    props: Optional<CategoryProps, 'subCategories'>,
    id?: UniqueEntityID,
  ) {
    const category = new Category(
      {
        subCategories: new CategoryList(),
        ...props,
      },
      id,
    )

    return category
  }
}

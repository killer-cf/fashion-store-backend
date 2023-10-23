import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SubCategoryList } from './sub-category-list'
import { Optional } from '@/core/types/optional'

export interface CategoryProps {
  name: string
  parentCategoryId?: UniqueEntityID
  subCategories: SubCategoryList
}

export class Category extends Entity<CategoryProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
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

  set subCategories(subCategories: SubCategoryList) {
    this.props.subCategories = subCategories
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
        subCategories: new SubCategoryList(),
        ...props,
      },
      id,
    )

    return category
  }
}

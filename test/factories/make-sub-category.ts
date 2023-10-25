import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  SubCategory,
  SubCategoryProps,
} from '@/domain/store/enterprise/entities/sub-category'

export function makeSubCategory(
  override: Partial<SubCategoryProps> = {},
  id?: UniqueEntityID,
) {
  const subCategory = SubCategory.create(
    {
      subCategoryId: new UniqueEntityID(),
      parentCategoryId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return subCategory
}

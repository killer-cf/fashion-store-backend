import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SubCategory } from '@/domain/store/enterprise/entities/sub-category'
import { Prisma, Category as PrismaSubCategory } from '@prisma/client'

export class PrismaSubCategoryMapper {
  static toDomain(raw: PrismaSubCategory): SubCategory {
    if (!raw.parentCategoryId) {
      throw new Error('Invalid subcategory type')
    }

    return SubCategory.create(
      {
        subCategoryId: new UniqueEntityID(raw.id),
        parentCategoryId: new UniqueEntityID(raw.parentCategoryId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdateMany(
    subCategory: SubCategory[],
  ): Prisma.CategoryUpdateManyArgs {
    const subcategoryIds = subCategory.map((subCategory) => {
      return subCategory.subCategoryId.toString()
    })

    return {
      where: {
        id: {
          in: subcategoryIds,
        },
      },
      data: {
        parentCategoryId: subCategory[0].parentCategoryId.toString(),
      },
    }
  }
}

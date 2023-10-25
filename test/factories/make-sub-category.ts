import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  SubCategory,
  SubCategoryProps,
} from '@/domain/store/enterprise/entities/sub-category'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class SubCategoryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaSubCategory(
    data: Partial<SubCategoryProps> = {},
  ): Promise<SubCategory> {
    const subCategory = makeSubCategory(data)

    await this.prisma.category.update({
      where: {
        id: subCategory.subCategoryId.toString(),
      },
      data: {
        parentCategoryId: subCategory.parentCategoryId.toString(),
      },
    })

    return subCategory
  }
}

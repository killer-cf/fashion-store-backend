import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { DeleteCategoryUseCase } from '@/domain/store/application/use-cases/delete-category'

@Controller('/categories/:id')
export class DeleteCategoryController {
  constructor(private deleteCategory: DeleteCategoryUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles(['ADMIN'])
  async handle(@Param('id') id: string) {
    const result = await this.deleteCategory.execute({
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

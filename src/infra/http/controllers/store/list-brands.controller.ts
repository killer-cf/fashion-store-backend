import { ListBrandsUseCase } from '@/domain/store/application/use-cases/list-brands'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { BrandPresenter } from '../../presenters/brand-presenter'
import { Roles } from '@/infra/auth/roles.decorator'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/brands')
export class ListBrandsController {
  constructor(private listBrands: ListBrandsUseCase) {}

  @Get()
  @Roles(['ADMIN'])
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.listBrands.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const brands = result.value.brands.map((brand) =>
      BrandPresenter.toHTTP(brand),
    )

    return { brands }
  }
}

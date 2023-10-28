import { CreateBrandUseCase } from '@/domain/store/application/use-cases/create-brand'
import { BrandAlreadyExistsError } from '@/domain/store/application/use-cases/errors/brand-already-exists-error'
import { Roles } from '@/infra/auth/roles.decorator'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

const createBrandSchema = z.object({
  name: z.string(),
})

type CreateBrandBody = z.infer<typeof createBrandSchema>

const bodyValidationPipe = new ZodValidationPipe(createBrandSchema)

@Controller('/brands')
export class CreateBrandController {
  constructor(private createBrand: CreateBrandUseCase) {}

  @Post()
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: CreateBrandBody) {
    const { name } = body

    const result = await this.createBrand.execute({ name })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case BrandAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

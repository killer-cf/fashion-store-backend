import { ClientAlreadyExistsError } from '@/domain/store/application/use-cases/errors/client-already-exists-error'
import { RegisterClientUseCase } from '@/domain/store/application/use-cases/register-client'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

const createAccountSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(8),
})

type CreateAccountBody = z.infer<typeof createAccountSchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerClient: RegisterClientUseCase) {}

  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: CreateAccountBody) {
    const { name, email, password, phone } = body

    const result = await this.registerClient.execute({
      name,
      email,
      password,
      phone,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ClientAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

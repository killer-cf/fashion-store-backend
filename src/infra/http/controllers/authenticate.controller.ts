import { AuthenticateClientUseCase } from '@/domain/store/application/use-cases/authenticate-client'
import { WrongCredentialsError } from '@/domain/store/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string(),
  password: z.string(),
})

type AuthenticateBodyType = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateClientUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodyType) {
    const { password, email } = body

    const result = await this.authenticateStudent.execute({ password, email })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const accessToken = result.value.access_token

    return { access_token: accessToken }
  }
}

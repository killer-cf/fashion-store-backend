import { Body, Controller, Post } from '@nestjs/common'

@Controller('/products')
export class CreateProductController {
  @Post()
  async handle(@Body() body: any) {
    console.log(body)
  }
}

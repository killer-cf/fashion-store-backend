import { Module } from '@nestjs/common'
import { CreateProductController } from './controllers/create-product.controller'

@Module({
  controllers: [CreateProductController],
})
export class HttpModule {}

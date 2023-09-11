import { Module } from '@nestjs/common'
import { CreateProductController } from './controllers/create-product.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateProductController],
})
export class HttpModule {}

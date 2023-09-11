import { Module } from '@nestjs/common'
import { CreateProductController } from './controllers/create-product.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateProductUseCase } from '@/domain/store/application/use-cases/create-product'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateProductController],
  providers: [CreateProductUseCase],
})
export class HttpModule {}

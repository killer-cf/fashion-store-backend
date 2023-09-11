import { Module } from '@nestjs/common'
import { CreateProductController } from './controllers/create-product.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateProductUseCase } from '@/domain/store/application/use-cases/create-product'
import { ListProductsController } from './controllers/list-products.controller'
import { ListProductsUseCase } from '@/domain/store/application/use-cases/list-products'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateProductController, ListProductsController],
  providers: [CreateProductUseCase, ListProductsUseCase],
})
export class HttpModule {}

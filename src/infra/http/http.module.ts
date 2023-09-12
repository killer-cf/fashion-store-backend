import { Module } from '@nestjs/common'
import { CreateProductController } from './controllers/create-product.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateProductUseCase } from '@/domain/store/application/use-cases/create-product'
import { ListProductsController } from './controllers/list-products.controller'
import { ListProductsUseCase } from '@/domain/store/application/use-cases/list-products'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateAccountController } from './controllers/create-account.controller'
import { RegisterClientUseCase } from '@/domain/store/application/use-cases/register-client'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateProductController,
    ListProductsController,
    CreateAccountController,
  ],
  providers: [CreateProductUseCase, ListProductsUseCase, RegisterClientUseCase],
})
export class HttpModule {}

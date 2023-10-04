import { Module } from '@nestjs/common'
import { CreateProductController } from './controllers/create-product.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateProductUseCase } from '@/domain/store/application/use-cases/create-product'
import { ListProductsController } from './controllers/list-products.controller'
import { ListProductsUseCase } from '@/domain/store/application/use-cases/list-products'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateAccountController } from './controllers/create-account.controller'
import { RegisterClientUseCase } from '@/domain/store/application/use-cases/register-client'
import { AuthenticateClientUseCase } from '@/domain/store/application/use-cases/authenticate-client'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { CreateOrderUseCase } from '@/domain/store/application/use-cases/create-order'
import { UploadImageController } from './controllers/upload-image.controller'
import { UploadAndCreateImageUseCase } from '@/domain/store/application/use-cases/upload-and-create-image'
import { StorageModule } from '../storage/storage.module'
import { CreateBrandController } from './controllers/create-brand.controller'
import { CreateBrandUseCase } from '@/domain/store/application/use-cases/create-brand'
import { ListBrandsController } from './controllers/list-brands.controller'
import { ListBrandsUseCase } from '@/domain/store/application/use-cases/list-brands'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateProductController,
    ListProductsController,
    CreateAccountController,
    AuthenticateController,
    CreateOrderController,
    UploadImageController,
    CreateBrandController,
    ListBrandsController,
  ],
  providers: [
    CreateProductUseCase,
    ListProductsUseCase,
    RegisterClientUseCase,
    AuthenticateClientUseCase,
    CreateOrderUseCase,
    UploadAndCreateImageUseCase,
    CreateBrandUseCase,
    ListBrandsUseCase,
  ],
})
export class HttpModule {}

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
import { ActivateProductController } from './controllers/activate-product.controller'
import { ActivateProductUseCase } from '@/domain/store/application/use-cases/activate-product'
import { DisableProductController } from './controllers/disable-product.controller'
import { DisableProductUseCase } from '@/domain/store/application/use-cases/disable-product'
import { GetProductController } from './controllers/get-product.controller'
import { GetProductUseCase } from '@/domain/store/application/use-cases/get-product'
import { GetProductAdminController } from './controllers/get-product-admin.controller'
import { ListProductsAdminController } from './controllers/list-products-admin.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateProductController,
    ListProductsController,
    ListProductsAdminController,
    CreateAccountController,
    AuthenticateController,
    CreateOrderController,
    UploadImageController,
    CreateBrandController,
    ListBrandsController,
    ActivateProductController,
    DisableProductController,
    GetProductController,
    GetProductAdminController,
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
    ActivateProductUseCase,
    DisableProductUseCase,
    GetProductUseCase,
  ],
})
export class HttpModule {}

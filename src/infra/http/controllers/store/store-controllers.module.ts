import { ActivateProductUseCase } from '@/domain/store/application/use-cases/activate-product'
import { AuthenticateClientUseCase } from '@/domain/store/application/use-cases/authenticate-client'
import { CreateBrandUseCase } from '@/domain/store/application/use-cases/create-brand'
import { CreateOrderUseCase } from '@/domain/store/application/use-cases/create-order'
import { CreateProductUseCase } from '@/domain/store/application/use-cases/create-product'
import { DisableProductUseCase } from '@/domain/store/application/use-cases/disable-product'
import { GetProductUseCase } from '@/domain/store/application/use-cases/get-product'
import { ListBrandsUseCase } from '@/domain/store/application/use-cases/list-brands'
import { ListProductsUseCase } from '@/domain/store/application/use-cases/list-products'
import { RegisterClientUseCase } from '@/domain/store/application/use-cases/register-client'
import { UploadAndCreateImageUseCase } from '@/domain/store/application/use-cases/upload-and-create-image'
import { Module } from '@nestjs/common'
import { ActivateProductController } from './activate-product.controller'
import { AuthenticateController } from './authenticate.controller'
import { CreateAccountController } from './create-account.controller'
import { CreateBrandController } from './create-brand.controller'
import { CreateOrderController } from './create-order.controller'
import { CreateProductController } from './create-product.controller'
import { DisableProductController } from './disable-product.controller'
import { GetProductAdminController } from './get-product-admin.controller'
import { GetProductController } from './get-product.controller'
import { ListBrandsController } from './list-brands.controller'
import { ListProductsAdminController } from './list-products-admin.controller'
import { ListProductsController } from './list-products.controller'
import { UploadImageController } from './upload-image.controller'
import { DatabaseModule } from '@/infra/database/database.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { StorageModule } from '@/infra/storage/storage.module'
import { CreateCategoryController } from './create-category.controller'
import { CreateCategoryUseCase } from '@/domain/store/application/use-cases/create-category'

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
    CreateCategoryController,
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
    CreateCategoryUseCase,
  ],
})
export class StoreControllersModule {}

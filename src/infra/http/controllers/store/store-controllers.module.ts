import { ActivateProductUseCase } from '@/domain/store/application/use-cases/activate-product'
import { AuthenticateClientUseCase } from '@/domain/store/application/use-cases/authenticate-client'
import { CreateBrandUseCase } from '@/domain/store/application/use-cases/create-brand'
import { CreateCategoryUseCase } from '@/domain/store/application/use-cases/create-category'
import { CreateOrderUseCase } from '@/domain/store/application/use-cases/create-order'
import { CreateProductUseCase } from '@/domain/store/application/use-cases/create-product'
import { DeleteCategoryUseCase } from '@/domain/store/application/use-cases/delete-category'
import { DisableProductUseCase } from '@/domain/store/application/use-cases/disable-product'
import { EditCategoryUseCase } from '@/domain/store/application/use-cases/edit-category'
import { EditProductUseCase } from '@/domain/store/application/use-cases/edit-product'
import { GetProductUseCase } from '@/domain/store/application/use-cases/get-product'
import { ListBrandsUseCase } from '@/domain/store/application/use-cases/list-brands'
import { ListCategoriesUseCase } from '@/domain/store/application/use-cases/list-categories'
import { ListProductsUseCase } from '@/domain/store/application/use-cases/list-products'
import { ListProductsByCategoryUseCase } from '@/domain/store/application/use-cases/list-products-by-category'
import { RegisterClientUseCase } from '@/domain/store/application/use-cases/register-client'
import { UploadAndCreateImageUseCase } from '@/domain/store/application/use-cases/upload-and-create-image'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { StorageModule } from '@/infra/storage/storage.module'
import { Module } from '@nestjs/common'
import { CreateBrandController } from './brand/create-brand.controller'
import { ListBrandsController } from './brand/list-brands.controller'
import { CreateCategoryController } from './category/create-category.controller'
import { DeleteCategoryController } from './category/delete-category.controller'
import { EditCategoryController } from './category/edit-category.controller'
import { ListCategoriesController } from './category/list-categories.controller'
import { UploadImageController } from './image/upload-image.controller'
import { CreateOrderController } from './order/create-order.controller'
import { ActivateProductController } from './product/activate-product.controller'
import { CreateProductController } from './product/create-product.controller'
import { DisableProductController } from './product/disable-product.controller'
import { EditProductController } from './product/edit-product.controller'
import { GetProductAdminController } from './product/get-product-admin.controller'
import { GetProductController } from './product/get-product.controller'
import { ListProductsAdminController } from './product/list-products-admin.controller'
import { ListProductsByCategoryController } from './product/list-products-by-category.controller'
import { ListProductsController } from './product/list-products.controller'
import { AuthenticateController } from './user/authenticate.controller'
import { CreateAccountController } from './user/create-account.controller'
import { DatabaseModule } from '@/infra/database/database.module'
import { ValidateCouponUseCase } from '@/domain/coupon/application/use-cases/validate-coupon'
import { DateValidationModule } from '@/infra/date-validation/date-validation.module'

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    StorageModule,
    DateValidationModule,
  ],
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
    DeleteCategoryController,
    EditCategoryController,
    ListCategoriesController,
    EditProductController,
    ListProductsByCategoryController,
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
    DeleteCategoryUseCase,
    EditCategoryUseCase,
    ListCategoriesUseCase,
    EditProductUseCase,
    ListProductsByCategoryUseCase,
    ValidateCouponUseCase,
  ],
})
export class StoreControllersModule {}

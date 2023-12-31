import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ProductsRepository } from '@/domain/store/application/repositories/products-repository'
import { PrismaProductsRepository } from './prisma/repositories/prisma-products-repository'
import { ClientsRepository } from '@/domain/store/application/repositories/clients-repository'
import { PrismaClientsRepository } from './prisma/repositories/prisma-clients-repository'
import { OrdersRepository } from '@/domain/store/application/repositories/orders-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { AdminsRepository } from '@/domain/store/application/repositories/admins-repository'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { BrandsRepository } from '@/domain/store/application/repositories/brands-repository'
import { PrismaBrandsRepository } from './prisma/repositories/prisma-brands-repository'
import { ImagesRepository } from '@/domain/store/application/repositories/images-repository'
import { PrismaImagesRepository } from './prisma/repositories/prisma-images-repository'
import { ProductImagesRepository } from '@/domain/store/application/repositories/product-images-repository'
import { PrismaProductImagesRepository } from './prisma/repositories/prisma-product-image-repository'
import { CacheModule } from '../cache/cache.module'
import { CouponsRepository } from '@/domain/coupon/application/repositories/coupons-repository'
import { PrismaCouponsRepository } from './prisma/repositories/prisma-coupons-repository'
import { CategoriesRepository } from '@/domain/store/application/repositories/categories-repository'
import { PrismaCategoriesRepository } from './prisma/repositories/prisma-category-repository'
import { ProductCategoriesRepository } from '@/domain/store/application/repositories/product-categories-repository'
import { PrismaProductCategoriesRepository } from './prisma/repositories/prisma-product-categories-repository'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    { provide: ProductsRepository, useClass: PrismaProductsRepository },
    { provide: ClientsRepository, useClass: PrismaClientsRepository },
    { provide: AdminsRepository, useClass: PrismaAdminsRepository },
    { provide: OrdersRepository, useClass: PrismaOrdersRepository },
    { provide: BrandsRepository, useClass: PrismaBrandsRepository },
    { provide: ImagesRepository, useClass: PrismaImagesRepository },
    {
      provide: ProductImagesRepository,
      useClass: PrismaProductImagesRepository,
    },
    {
      provide: CouponsRepository,
      useClass: PrismaCouponsRepository,
    },
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
    {
      provide: ProductCategoriesRepository,
      useClass: PrismaProductCategoriesRepository,
    },
  ],
  exports: [
    PrismaService,
    ProductsRepository,
    ClientsRepository,
    AdminsRepository,
    OrdersRepository,
    BrandsRepository,
    ImagesRepository,
    ProductImagesRepository,
    CouponsRepository,
    CategoriesRepository,
    ProductCategoriesRepository,
  ],
})
export class DatabaseModule {}

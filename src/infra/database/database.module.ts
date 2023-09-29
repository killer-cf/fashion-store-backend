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

@Module({
  providers: [
    PrismaService,
    { provide: ProductsRepository, useClass: PrismaProductsRepository },
    { provide: ClientsRepository, useClass: PrismaClientsRepository },
    { provide: AdminsRepository, useClass: PrismaAdminsRepository },
    { provide: OrdersRepository, useClass: PrismaOrdersRepository },
    { provide: BrandsRepository, useClass: PrismaBrandsRepository },
  ],
  exports: [
    PrismaService,
    ProductsRepository,
    ClientsRepository,
    AdminsRepository,
    OrdersRepository,
    BrandsRepository,
  ],
})
export class DatabaseModule {}

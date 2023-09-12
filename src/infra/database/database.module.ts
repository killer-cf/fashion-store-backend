import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ProductsRepository } from '@/domain/store/application/repositories/products-repository'
import { PrismaProductsRepository } from './prisma/repositories/prisma-products-repository'
import { ClientsRepository } from '@/domain/store/application/repositories/clients-repository'
import { PrismaClientsRepository } from './prisma/repositories/prisma-clients-repository'

@Module({
  providers: [
    PrismaService,
    { provide: ProductsRepository, useClass: PrismaProductsRepository },
    { provide: ClientsRepository, useClass: PrismaClientsRepository },
  ],
  exports: [PrismaService, ProductsRepository, ClientsRepository],
})
export class DatabaseModule {}

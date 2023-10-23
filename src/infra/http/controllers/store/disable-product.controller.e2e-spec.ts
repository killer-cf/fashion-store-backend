import { ProductStatus } from '@/domain/store/enterprise/entities/value-objects/product-status'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { BrandFactory } from 'test/factories/make-brand'
import { ProductFactory } from 'test/factories/make-product'

describe('Disable product (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let adminFactory: AdminFactory
  let brandFactory: BrandFactory
  let productFactory: ProductFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, BrandFactory, ProductFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    brandFactory = moduleRef.get(BrandFactory)
    productFactory = moduleRef.get(ProductFactory)

    await app.init()
  })

  test('[PATCH] /products/:productId/disable', async () => {
    const admin = await adminFactory.makePrismaAdmin({})
    const brand = await brandFactory.makePrismaBrand({ name: 'Xiaomi' })
    const product = await productFactory.makePrismaProduct({
      status: ProductStatus.create('ACTIVE'),
      brandId: brand.id,
    })

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'ADMIN' })

    const productId = product.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/products/${productId}/disable`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send()

    expect(response.statusCode).toBe(204)

    const productOnDatabase = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    })

    expect(productOnDatabase).toBeTruthy()
    expect(productOnDatabase?.status).toEqual('DISABLED')
  })

  test('[PATCH] /products/:productId/disable (Unauthorized)', async () => {
    const admin = await adminFactory.makePrismaAdmin({})
    const brand = await brandFactory.makePrismaBrand({ name: 'Xiaomi2' })
    const product = await productFactory.makePrismaProduct({
      status: ProductStatus.create('ACTIVE'),
      brandId: brand.id,
    })

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'CLIENT' })

    const productId = product.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/products/${productId}/disable`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send()

    expect(response.statusCode).toBe(403)
  })
})

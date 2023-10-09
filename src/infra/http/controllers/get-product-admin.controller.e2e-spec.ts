import { ProductStatus } from '@/domain/store/enterprise/entities/value-objects/product-status'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { BrandFactory } from 'test/factories/make-brand'
import { ProductFactory } from 'test/factories/make-product'

describe('Admin Get product (e2e)', () => {
  let app: INestApplication
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
    adminFactory = moduleRef.get(AdminFactory)
    brandFactory = moduleRef.get(BrandFactory)
    productFactory = moduleRef.get(ProductFactory)

    await app.init()
  })

  test('[GET] /admin/products/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin({})
    const brand = await brandFactory.makePrismaBrand({ name: 'Xiaomi' })
    const product = await productFactory.makePrismaProduct({
      status: ProductStatus.create('DISABLED'),
      brandId: brand.id,
    })

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'ADMIN' })

    const productId = product.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/admin/products/${productId}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send()

    expect(response.statusCode).toBe(200)
  })
})

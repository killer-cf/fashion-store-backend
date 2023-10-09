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

describe('List products (e2e)', () => {
  let app: INestApplication
  let productFactory: ProductFactory
  let brandFactory: BrandFactory
  let adminFactory: AdminFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ProductFactory, BrandFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    productFactory = moduleRef.get(ProductFactory)
    brandFactory = moduleRef.get(BrandFactory)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[GET] /admin/products', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const brand = await brandFactory.makePrismaBrand()

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'ADMIN' })

    await Promise.all([
      productFactory.makePrismaProduct({
        name: 'Xiaomi Redimi 10',
        brandId: brand.id,
        price: 10000,
      }),
      productFactory.makePrismaProduct({
        name: 'Xiaomi mi 9t',
        brandId: brand.id,
        price: 30000,
        status: ProductStatus.create('DISABLED'),
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/admin/products')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({})

    expect(response.statusCode).toBe(200)
    expect(response.body.products).toHaveLength(2)
    expect(response.body.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Xiaomi Redimi 10', price: 10000 }),
        expect.objectContaining({ name: 'Xiaomi mi 9t', price: 30000 }),
      ]),
    )
  })

  test('[GET] /admin/products (Unauthorized)', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const brand = await brandFactory.makePrismaBrand()

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'CLIENT' })

    await Promise.all([
      productFactory.makePrismaProduct({
        name: 'Xiaomi Redimi 10',
        brandId: brand.id,
        price: 10000,
      }),
      productFactory.makePrismaProduct({
        name: 'Xiaomi mi 9t',
        brandId: brand.id,
        price: 30000,
        status: ProductStatus.create('DISABLED'),
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/admin/products')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({})

    expect(response.statusCode).toBe(403)
  })
})

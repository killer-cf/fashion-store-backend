import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { BrandFactory } from 'test/factories/make-brand'
import { ProductFactory } from 'test/factories/make-product'

describe('List products (e2e)', () => {
  let app: INestApplication
  let productFactory: ProductFactory
  let brandFactory: BrandFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ProductFactory, BrandFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    productFactory = moduleRef.get(ProductFactory)
    brandFactory = moduleRef.get(BrandFactory)

    await app.init()
  })

  test('[GET] /products', async () => {
    const brand = await brandFactory.makePrismaBrand()

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
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/products')
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
})

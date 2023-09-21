import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ProductFactory } from 'test/factories/make-product'

describe('List products (e2e)', () => {
  let app: INestApplication
  let productFactory: ProductFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ProductFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    productFactory = moduleRef.get(ProductFactory)

    await app.init()
  })

  test('[GET] /products', async () => {
    await Promise.all([
      productFactory.makePrismaProduct({
        name: 'Xiaomi Redimi 10',
        price: 10000,
      }),
      productFactory.makePrismaProduct({
        name: 'Xiaomi mi 9t',
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

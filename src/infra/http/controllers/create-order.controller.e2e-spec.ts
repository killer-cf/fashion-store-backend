import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { BrandFactory } from 'test/factories/make-brand'
import { ClientFactory } from 'test/factories/make-client'
import { ProductFactory } from 'test/factories/make-product'

describe('Create order (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let clientFactory: ClientFactory
  let productFactory: ProductFactory
  let brandFactory: BrandFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory, ProductFactory, BrandFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    productFactory = moduleRef.get(ProductFactory)
    brandFactory = moduleRef.get(BrandFactory)

    await app.init()
  })

  test('[POST] /orders', async () => {
    const client = await clientFactory.makePrismaClient()

    const brand = await brandFactory.makePrismaBrand()

    const [product1, product2] = await Promise.all([
      productFactory.makePrismaProduct({
        price: 30000,
        brandId: brand.id,
      }),
      productFactory.makePrismaProduct({
        price: 90000,
        brandId: brand.id,
      }),
    ])

    const accessToken = jwt.sign({ sub: client.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        address: 'Rua Oscar Raposo, 200',
        items: [
          {
            productId: product1.id.toString(),
            quantity: 1,
          },
          {
            productId: product2.id.toString(),
            quantity: 2,
          },
        ],
      })

    expect(response.statusCode).toBe(201)

    const order = await prisma.order.findFirst({
      where: {
        client_id: client.id.toString(),
      },
      include: {
        order_items: true,
      },
    })

    expect(order).toBeTruthy()
    expect(order?.totalPrice).toEqual(210_000)
    expect(order?.order_items).toHaveLength(2)
    expect(order?.order_items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          product_id: product1.id.toString(),
          quantity: 1,
        }),
        expect.objectContaining({
          product_id: product2.id.toString(),
          quantity: 2,
        }),
      ]),
    )
  })
})

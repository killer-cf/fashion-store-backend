import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create order (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /orders', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'jopnh doe',
        email: 'jonh@doe.com',
        password: 'password',
      },
    })

    const product1 = await prisma.product.create({
      data: {
        name: 'Tv 4k',
        price: 30000,
        sku: 'adsdasd',
        brand: 'xiaomi',
        model: '9t',
        color: 'red',
      },
    })

    const product2 = await prisma.product.create({
      data: {
        name: 'Tv 8k',
        price: 90000,
        sku: 'adsdsdasd',
        brand: 'xiaomi',
        model: '10',
        color: 'green',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        address: 'Rua Oscar Raposo, 200',
        items: [
          {
            productId: product1.id,
            quantity: 1,
          },
          {
            productId: product2.id,
            quantity: 2,
          },
        ],
      })

    expect(response.statusCode).toBe(201)

    const order = await prisma.order.findFirst({
      where: {
        client_id: user.id,
      },
      include: {
        order_items: true,
      },
    })

    expect(order).toBeTruthy()
    expect(order?.order_items).toHaveLength(2)
    expect(order?.order_items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          product_id: product1.id,
          quantity: 1,
        }),
        expect.objectContaining({
          product_id: product2.id,
          quantity: 2,
        }),
      ]),
    )
  })
})

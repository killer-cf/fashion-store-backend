import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { BrandFactory } from 'test/factories/make-brand'
import { ClientFactory } from 'test/factories/make-client'
import { CouponFactory } from 'test/factories/make-coupon'
import { ProductFactory } from 'test/factories/make-product'
import { waitFor } from 'test/utils/wait-for'

describe('On Create order event (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let clientFactory: ClientFactory
  let productFactory: ProductFactory
  let brandFactory: BrandFactory
  let couponFactory: CouponFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory, ProductFactory, BrandFactory, CouponFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    productFactory = moduleRef.get(ProductFactory)
    brandFactory = moduleRef.get(BrandFactory)
    couponFactory = moduleRef.get(CouponFactory)

    DomainEvents.shouldRun = true

    await app.init()
  })

  test('should be able to apply coupon when create an order', async () => {
    const client = await clientFactory.makePrismaClient()

    const coupon = await couponFactory.makePrismaCoupon({
      quantity: 10,
      discount: 10000,
      minValue: 0,
    })

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

    const accessToken = jwt.sign({ sub: client.id.toString(), role: 'CLIENT' })

    await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        address: 'Rua Oscar Raposo, 200',
        couponCode: coupon.code,
        value: 210000,
        deliveryFee: 0,
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

    await waitFor(async () => {
      const couponOnDatabase = await prisma.coupon.findUnique({
        where: {
          code: coupon.code,
        },
      })

      expect(couponOnDatabase?.quantity).toBe(9)
    })

    const order = await prisma.order.findFirst({
      where: {
        client_id: client.id.toString(),
      },
    })

    expect(order?.subtotal).toEqual(210000)
    expect(order?.totalPrice).toEqual(200000)
  })
})

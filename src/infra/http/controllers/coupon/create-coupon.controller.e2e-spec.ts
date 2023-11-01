import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

describe('Create coupon (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[POST] /coupons', async () => {
    const admin = await adminFactory.makePrismaAdmin({})

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .post('/coupons')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        code: 'PRIMEIRACOMPRA',
        description: 'Cupom de primeira compra',
        status: 'ACTIVE',
        quantity: 1000,
        minValue: 10000,
        discount: 5000,
        discountType: 'amount',
        expiresAt: new Date(),
        maxDiscount: 5000,
        isSingleUse: false,
        isFirstOrder: false,
        isFreeShipping: false,
      })

    expect(response.statusCode).toBe(201)

    const coupon = await prisma.coupon.findUnique({
      where: {
        code: 'PRIMEIRACOMPRA',
      },
    })

    expect(coupon).toBeTruthy()
  })

  test('[POST] /coupons (Unauthorized)', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'CLIENT' })

    const response = await request(app.getHttpServer())
      .post('/coupons')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        code: 'PRIMEIRACOMPRA2',
        description: 'Cupom de primeira compra',
        status: 'ACTIVE',
        quantity: 1000,
        minValue: 10000,
        discount: 5000,
        discountType: 'amount',
        expiresAt: new Date(),
        maxDiscount: 5000,
        isSingleUse: false,
        isFirstOrder: false,
        isFreeShipping: false,
      })

    expect(response.statusCode).toBe(403)

    const coupon = await prisma.coupon.findUnique({
      where: {
        code: 'PRIMEIRACOMPRA2',
      },
    })

    expect(coupon).toBeFalsy()
  })
})

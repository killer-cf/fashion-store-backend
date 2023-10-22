import { CouponStatus } from '@/domain/coupon/enterprise/entities/value-objects/coupon-status'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { BrandFactory } from 'test/factories/make-brand'
import { CouponFactory } from 'test/factories/make-coupon'

describe('List coupons (e2e)', () => {
  let app: INestApplication
  let couponFactory: CouponFactory
  let adminFactory: AdminFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CouponFactory, BrandFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    couponFactory = moduleRef.get(CouponFactory)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[GET] /coupons', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'ADMIN' })

    await Promise.all([
      couponFactory.makePrismaCoupon({
        code: 'PRIMEIRACOMPRA',
        discount: 10000,
      }),
      couponFactory.makePrismaCoupon({
        code: 'PIROFOR',
        discount: 20000,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/coupons')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({})

    expect(response.statusCode).toBe(200)
    expect(response.body.coupons).toHaveLength(2)
    expect(response.body.coupons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'PRIMEIRACOMPRA', discount: 10000 }),
        expect.objectContaining({ code: 'PIROFOR', discount: 20000 }),
      ]),
    )
  })

  test('[GET] /coupons (Unauthorized)', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'CLIENT' })

    const response = await request(app.getHttpServer())
      .get('/coupons')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({})

    expect(response.statusCode).toBe(403)
  })
})

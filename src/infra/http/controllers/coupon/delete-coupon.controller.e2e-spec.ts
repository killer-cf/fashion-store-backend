import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { CouponFactory } from 'test/factories/make-coupon'

describe('Admin Delete coupon (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
  let couponFactory: CouponFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, CouponFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    couponFactory = moduleRef.get(CouponFactory)

    await app.init()
  })

  test('[DELETE] /coupons/:code', async () => {
    const admin = await adminFactory.makePrismaAdmin({})
    const coupon = await couponFactory.makePrismaCoupon({
      code: 'PRIMEIRACOMPRA',
      discount: 10000,
    })

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .delete(`/coupons/${coupon.code}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send()

    expect(response.statusCode).toBe(204)
  })

  test('[DELETE] /coupons/:code (Unauthorized)', async () => {
    const admin = await adminFactory.makePrismaAdmin({})

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'CLIENT' })

    const response = await request(app.getHttpServer())
      .delete(`/coupons/PRIMEIRACOMPRA`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send()

    expect(response.statusCode).toBe(403)
  })
})

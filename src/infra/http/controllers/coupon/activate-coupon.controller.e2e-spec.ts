import { CouponStatus } from '@/domain/coupon/enterprise/entities/value-objects/coupon-status'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { CouponFactory } from 'test/factories/make-coupon'

describe('Activate coupon (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
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
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    couponFactory = moduleRef.get(CouponFactory)

    await app.init()
  })

  test('[PATCH] /coupons/:code/activate', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const coupon = await couponFactory.makePrismaCoupon({
      status: CouponStatus.create('DISABLED'),
    })

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .patch(`/coupons/${coupon.code}/activate`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send()

    expect(response.statusCode).toBe(204)

    const couponOnDatabase = await prisma.coupon.findUnique({
      where: {
        code: coupon.code,
      },
    })

    expect(couponOnDatabase).toBeTruthy()
    expect(couponOnDatabase?.status).toEqual('ACTIVE')
  })

  test('[PATCH] /coupons/:code/activate (Unauthorized)', async () => {
    const admin = await adminFactory.makePrismaAdmin({})
    const coupon = await couponFactory.makePrismaCoupon({
      code: 'PRIMEIRA',
      status: CouponStatus.create('DISABLED'),
    })

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'CLIENT' })

    const response = await request(app.getHttpServer())
      .patch(`/coupons/${coupon.code}/activate`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send()

    expect(response.statusCode).toBe(403)
  })
})

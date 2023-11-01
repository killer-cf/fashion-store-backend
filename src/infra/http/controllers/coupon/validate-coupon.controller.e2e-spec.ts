import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'
import { CouponFactory } from 'test/factories/make-coupon'

describe('Validate coupon (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let clientFactory: ClientFactory
  let couponFactory: CouponFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory, CouponFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    clientFactory = moduleRef.get(ClientFactory)
    couponFactory = moduleRef.get(CouponFactory)

    await app.init()
  })

  test('[GET] /coupons/:code/validate', async () => {
    const client = await clientFactory.makePrismaClient()
    const coupon = await couponFactory.makePrismaCoupon({
      code: 'PRIMEIRACOMPRA',
    })

    const accessToken = jwt.sign({ sub: client.id.toString(), role: 'CLIENT' })

    const response = await request(app.getHttpServer())
      .get(`/coupons/${coupon.code}/validate?value=10000`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send()

    expect(response.statusCode).toBe(200)
  })

  test('[GET] /coupons/:code/validate (Unauthorized)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/coupons/PRIMEIRACOMPRA/validate?value=10000`)
      .send()

    expect(response.statusCode).toBe(401)
  })
})

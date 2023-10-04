import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { BrandFactory } from 'test/factories/make-brand'

describe('List brands (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let adminsFactory: AdminFactory
  let brandFactory: BrandFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [BrandFactory, AdminFactory],
    }).compile()

    jwt = moduleRef.get(JwtService)

    app = moduleRef.createNestApplication()
    brandFactory = moduleRef.get(BrandFactory)
    adminsFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[GET] /brands', async () => {
    Promise.all([
      brandFactory.makePrismaBrand({ name: 'Xiaomi' }),
      brandFactory.makePrismaBrand({ name: 'Apple' }),
    ])

    const admin = await adminsFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .get('/brands')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({})

    expect(response.statusCode).toBe(200)
    expect(response.body.brands).toHaveLength(2)
    expect(response.body.brands).toEqual([
      expect.objectContaining({ name: 'Apple' }),
      expect.objectContaining({ name: 'Xiaomi' }),
    ])
  })
})

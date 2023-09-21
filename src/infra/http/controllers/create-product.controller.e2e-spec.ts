import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

describe('Create product (e2e)', () => {
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

  test('[POST] /products', async () => {
    const admin = await adminFactory.makePrismaAdmin({})

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        name: 'Novo produto',
        price: 30000,
        sku: 'adsdasd',
        brand: 'xiaomi',
        model: '9t',
        color: 'red',
      })

    expect(response.statusCode).toBe(201)

    const product = await prisma.product.findFirst({
      where: {
        name: 'Novo produto',
        price: 30000,
      },
    })

    expect(product).toBeTruthy()
  })
})

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { BrandFactory } from 'test/factories/make-brand'

describe('Create product (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let adminFactory: AdminFactory
  let brandFactory: BrandFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, BrandFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    brandFactory = moduleRef.get(BrandFactory)

    await app.init()
  })

  test('[POST] /products', async () => {
    const admin = await adminFactory.makePrismaAdmin({})
    const brand = await brandFactory.makePrismaBrand({ name: 'Xiaomi' })

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        name: 'Novo produto',
        price: 30000,
        sku: 'adsdasd',
        brandName: 'Xiaomi',
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
    expect(product?.brand_id).toEqual(brand.id.toString())
  })

  test('[POST] /products (Unauthorized)', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const brand = await brandFactory.makePrismaBrand()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        name: 'Novo produto 2',
        price: 30000,
        sku: 'adasasooo',
        brandName: brand.name,
        model: '9t',
        color: 'red',
      })

    expect(response.statusCode).toBe(403)

    const product = await prisma.product.findFirst({
      where: {
        name: 'Novo produto 2',
        price: 30000,
      },
    })
    console.log(product)

    expect(product).toBeFalsy()
  })
})

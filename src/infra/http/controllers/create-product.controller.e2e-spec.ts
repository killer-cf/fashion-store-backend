import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { BrandFactory } from 'test/factories/make-brand'
import { ImageFactory } from 'test/factories/make-image'

describe('Create product (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let adminFactory: AdminFactory
  let brandFactory: BrandFactory
  let imageFactory: ImageFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, BrandFactory, ImageFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    brandFactory = moduleRef.get(BrandFactory)
    imageFactory = moduleRef.get(ImageFactory)

    await app.init()
  })

  test('[POST] /products', async () => {
    const admin = await adminFactory.makePrismaAdmin({})
    const brand = await brandFactory.makePrismaBrand({ name: 'Xiaomi' })

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'ADMIN' })

    const image = await imageFactory.makePrismaImage()

    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        name: 'Novo produto',
        price: 30000,
        sku: 'adsdasd',
        brandName: 'Xiaomi',
        model: '9t',
        description: 'Descrição do produto',
        colors: ['red'],
        imageIds: [image.id.toString()],
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

    const imageOnDataBase = await prisma.image.findMany({
      where: {
        product_id: product?.id,
      },
    })

    expect(imageOnDataBase).toHaveLength(1)
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
        description: 'Descrição do produto',
        colors: ['red'],
        imageIds: [],
      })

    expect(response.statusCode).toBe(403)

    const product = await prisma.product.findFirst({
      where: {
        name: 'Novo produto 2',
        price: 30000,
      },
    })

    expect(product).toBeFalsy()
  })
})

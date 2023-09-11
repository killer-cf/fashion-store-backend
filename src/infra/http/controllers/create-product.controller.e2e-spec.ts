import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create product (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /products', async () => {
    const response = await request(app.getHttpServer()).post('/products').send({
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

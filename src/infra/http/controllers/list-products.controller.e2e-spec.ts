import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('List products (e2e)', () => {
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

  test('[GET] /products', async () => {
    await prisma.product.createMany({
      data: [
        {
          name: 'Xiaomi Redimi 10',
          price: 10000,
          sku: 'adsdasd',
          brand: 'Xiaomi',
          model: 'Redimi 10',
          color: 'white',
        },
        {
          name: 'Xiaomi mi 9t',
          price: 30000,
          sku: 'kokokok',
          brand: 'Xiaomi',
          model: '9t',
          color: 'black',
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/products')
      .send({})

    expect(response.statusCode).toBe(200)
    expect(response.body.products).toHaveLength(2)
    expect(response.body.products).toEqual([
      expect.objectContaining({ name: 'Xiaomi Redimi 10' }),
      expect.objectContaining({ name: 'Xiaomi mi 9t' }),
    ])
  })
})

import { ProductStatus } from '@/domain/store/enterprise/entities/value-objects/product-status'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { BrandFactory } from 'test/factories/make-brand'
import { ProductFactory } from 'test/factories/make-product'

describe('Get product (e2e)', () => {
  let app: INestApplication
  let brandFactory: BrandFactory
  let productFactory: ProductFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [BrandFactory, ProductFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    brandFactory = moduleRef.get(BrandFactory)
    productFactory = moduleRef.get(ProductFactory)

    await app.init()
  })

  test('[GET] /products/:id', async () => {
    const brand = await brandFactory.makePrismaBrand({ name: 'Xiaomi' })
    const product = await productFactory.makePrismaProduct({
      status: ProductStatus.create('ACTIVE'),
      brandId: brand.id,
    })

    const productId = product.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .send()

    expect(response.statusCode).toBe(200)
  })
})

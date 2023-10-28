import { ProductStatus } from '@/domain/store/enterprise/entities/value-objects/product-status'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { BrandFactory } from 'test/factories/make-brand'
import { CategoryFactory } from 'test/factories/make-category'
import { ProductFactory } from 'test/factories/make-product'
import { ProductCategoryFactory } from 'test/factories/make-product-category'

describe('List products (e2e)', () => {
  let app: INestApplication
  let productFactory: ProductFactory
  let brandFactory: BrandFactory
  let categoryFactory: CategoryFactory
  let productCategoryFactory: ProductCategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ProductFactory,
        BrandFactory,
        CategoryFactory,
        ProductCategoryFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    productFactory = moduleRef.get(ProductFactory)
    brandFactory = moduleRef.get(BrandFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    productCategoryFactory = moduleRef.get(ProductCategoryFactory)

    await app.init()
  })

  test('[GET] /products/categories/:categoryId', async () => {
    const brand = await brandFactory.makePrismaBrand()

    const [prod1, prod2, prod3, catg1, catg2, catg3] = await Promise.all([
      productFactory.makePrismaProduct({
        name: 'Xiaomi Redimi 10',
        brandId: brand.id,
        price: 10000,
      }),
      productFactory.makePrismaProduct({
        name: 'Xiaomi mi 9t',
        brandId: brand.id,
        price: 30000,
      }),
      productFactory.makePrismaProduct({
        name: 'Xiaomi mi 11',
        brandId: brand.id,
        price: 90000,
        status: ProductStatus.create('DISABLED'),
      }),
      categoryFactory.makePrismaCategory({ name: 'Computer' }),
      categoryFactory.makePrismaCategory({ name: 'Eletronicos' }),
      categoryFactory.makePrismaCategory({ name: 'Celular' }),
    ])

    await Promise.all([
      productCategoryFactory.makePrismaProductCategory({
        productId: prod1.id,
        categoryId: catg1.id,
      }),
      productCategoryFactory.makePrismaProductCategory({
        productId: prod1.id,
        categoryId: catg2.id,
      }),
      productCategoryFactory.makePrismaProductCategory({
        productId: prod2.id,
        categoryId: catg2.id,
      }),
      productCategoryFactory.makePrismaProductCategory({
        productId: prod3.id,
        categoryId: catg3.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/products/categories/${catg2.id.toString()}?search=Xiaomi`)
      .send({})

    expect(response.statusCode).toBe(200)
    expect(response.body.products).toHaveLength(2)
    expect(response.body.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Xiaomi Redimi 10', price: 10000 }),
        expect.objectContaining({ name: 'Xiaomi mi 9t', price: 30000 }),
      ]),
    )
  })
})

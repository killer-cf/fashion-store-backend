import { ProductStatus } from '@/domain/store/enterprise/entities/value-objects/product-status'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { BrandFactory } from 'test/factories/make-brand'
import { CategoryFactory } from 'test/factories/make-category'
import { ImageFactory } from 'test/factories/make-image'
import { ProductFactory } from 'test/factories/make-product'
import { ProductCategoryFactory } from 'test/factories/make-product-category'
import { ProductImageFactory } from 'test/factories/make-product-image'

describe('Get product (e2e)', () => {
  let app: INestApplication
  let brandFactory: BrandFactory
  let productFactory: ProductFactory
  let imageFactory: ImageFactory
  let productImageFactory: ProductImageFactory
  let categoryFactory: CategoryFactory
  let productCategoryFactory: ProductCategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        BrandFactory,
        ProductFactory,
        ProductCategoryFactory,
        CategoryFactory,
        ProductImageFactory,
        ImageFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    brandFactory = moduleRef.get(BrandFactory)
    productFactory = moduleRef.get(ProductFactory)
    imageFactory = moduleRef.get(ImageFactory)
    productImageFactory = moduleRef.get(ProductImageFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    productCategoryFactory = moduleRef.get(ProductCategoryFactory)

    await app.init()
  })

  test('[GET] /products/:id', async () => {
    const [brand, img1, img2, ctg1, ctg2] = await Promise.all([
      brandFactory.makePrismaBrand({ name: 'Xiaomi' }),
      imageFactory.makePrismaImage(),
      imageFactory.makePrismaImage(),
      categoryFactory.makePrismaCategory(),
      categoryFactory.makePrismaCategory(),
    ])

    const product = await productFactory.makePrismaProduct({
      status: ProductStatus.create('ACTIVE'),
      brandId: brand.id,
    })

    await Promise.all([
      productImageFactory.makePrismaProductImage({
        imageId: img1.id,
        productId: product.id,
      }),
      productImageFactory.makePrismaProductImage({
        imageId: img2.id,
        productId: product.id,
      }),
      productCategoryFactory.makePrismaProductCategory({
        categoryId: ctg1.id,
        productId: product.id,
      }),
      productCategoryFactory.makePrismaProductCategory({
        categoryId: ctg2.id,
        productId: product.id,
      }),
    ])

    const productId = product.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.product.name).toEqual(product.name)
    expect(response.body.product.brand.name).toEqual(brand.name)
    expect(response.body.product.images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: img1.id.toString(),
          url: img1.url,
        }),
        expect.objectContaining({
          id: img2.id.toString(),
          url: img2.url,
        }),
      ]),
    )
    expect(response.body.product.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: ctg1.id.toString(),
          name: ctg1.name,
        }),
        expect.objectContaining({
          id: ctg2.id.toString(),
          name: ctg2.name,
        }),
      ]),
    )
  })
})

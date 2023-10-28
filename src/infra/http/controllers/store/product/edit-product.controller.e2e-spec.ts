import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { BrandFactory } from 'test/factories/make-brand'
import { CategoryFactory } from 'test/factories/make-category'
import { ImageFactory } from 'test/factories/make-image'
import { ProductFactory } from 'test/factories/make-product'
import { ProductCategoryFactory } from 'test/factories/make-product-category'
import { ProductImageFactory } from 'test/factories/make-product-image'

describe('Edit product (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let adminFactory: AdminFactory
  let brandFactory: BrandFactory
  let imageFactory: ImageFactory
  let categoryFactory: CategoryFactory
  let productFactory: ProductFactory
  let productCategoryFactory: ProductCategoryFactory
  let productImageFactory: ProductImageFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        BrandFactory,
        ImageFactory,
        CategoryFactory,
        ProductFactory,
        ProductCategoryFactory,
        ProductImageFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    brandFactory = moduleRef.get(BrandFactory)
    imageFactory = moduleRef.get(ImageFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    productFactory = moduleRef.get(ProductFactory)
    productCategoryFactory = moduleRef.get(ProductCategoryFactory)
    productImageFactory = moduleRef.get(ProductImageFactory)

    await app.init()
  })

  test('[PUT] /products', async () => {
    const [admin, brand, image1, image2, category1, category2] =
      await Promise.all([
        adminFactory.makePrismaAdmin(),
        brandFactory.makePrismaBrand({ name: 'Xiaomi' }),
        imageFactory.makePrismaImage(),
        imageFactory.makePrismaImage(),
        categoryFactory.makePrismaCategory(),
        categoryFactory.makePrismaCategory(),
      ])

    const product = await productFactory.makePrismaProduct({
      brandId: brand.id,
    })

    const [category3, image3, , , ,] = await Promise.all([
      categoryFactory.makePrismaCategory(),
      imageFactory.makePrismaImage(),
      productImageFactory.makePrismaProductImage({
        imageId: image1.id,
        productId: product.id,
      }),
      productImageFactory.makePrismaProductImage({
        imageId: image2.id,
        productId: product.id,
      }),

      productCategoryFactory.makePrismaProductCategory({
        categoryId: category1.id,
        productId: product.id,
      }),
      productCategoryFactory.makePrismaProductCategory({
        categoryId: category2.id,
        productId: product.id,
      }),
    ])

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .put(`/products/${product.id.toString()}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        name: 'Novo produto editado',
        price: 30000,
        description: 'Descrição do produto editado',
        colors: ['red'],
        imageIds: [image1.id.toString(), image3.id.toString()],
        categoriesIds: [category1.id.toString(), category3.id.toString()],
      })

    expect(response.statusCode).toBe(204)

    const productOnDataBase = await prisma.product.findFirst({
      where: {
        id: product.id.toString(),
      },
    })

    expect(productOnDataBase).toBeTruthy()
    expect(productOnDataBase?.name).toEqual('Novo produto editado')
    expect(productOnDataBase?.description).toEqual(
      'Descrição do produto editado',
    )

    const imagesOnDataBase = await prisma.image.findMany({
      where: {
        product_id: productOnDataBase?.id,
      },
    })

    expect(imagesOnDataBase).toHaveLength(2)
    expect(imagesOnDataBase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: image1.id.toString(),
        }),
        expect.objectContaining({
          id: image3.id.toString(),
        }),
      ]),
    )

    const productCategoryOnDataBase = await prisma.productCategories.findMany({
      where: {
        productId: productOnDataBase?.id,
      },
    })

    expect(productCategoryOnDataBase).toHaveLength(2)
    expect(productCategoryOnDataBase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          categoryId: category1.id.toString(),
        }),
        expect.objectContaining({
          categoryId: category3.id.toString(),
        }),
      ]),
    )
  })

  test('[PUT] /products (Unauthorized)', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const brand = await brandFactory.makePrismaBrand()

    const product = await productFactory.makePrismaProduct({
      brandId: brand.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .put(`/products/${product.id.toString()}`)
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

    const productOnDatabase = await prisma.product.findFirst({
      where: {
        name: 'Novo produto 2',
        price: 30000,
      },
    })

    expect(productOnDatabase).toBeFalsy()
  })
})

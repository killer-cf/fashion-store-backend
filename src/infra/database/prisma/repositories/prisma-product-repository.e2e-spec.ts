import { ProductsRepository } from '@/domain/store/application/repositories/products-repository'
import { AppModule } from '@/infra/app.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { ImageFactory } from 'test/factories/make-image'
import { ProductFactory } from 'test/factories/make-product'
import { ProductImageFactory } from 'test/factories/make-product-image'
import { BrandFactory } from 'test/factories/make-brand'

describe('Get products repository (e2e)', () => {
  let app: INestApplication
  let productFactory: ProductFactory
  let imageFactory: ImageFactory
  let productImageFactory: ProductImageFactory
  let cacheRepository: CacheRepository
  let productsRepository: ProductsRepository
  let brandFactory: BrandFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        ProductFactory,
        ImageFactory,
        ProductImageFactory,
        BrandFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    productFactory = moduleRef.get(ProductFactory)
    imageFactory = moduleRef.get(ImageFactory)
    productImageFactory = moduleRef.get(ProductImageFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    productsRepository = moduleRef.get(ProductsRepository)
    brandFactory = moduleRef.get(BrandFactory)

    await app.init()
  })

  it('should cache product details', async () => {
    const brand = await brandFactory.makePrismaBrand()

    const product = await productFactory.makePrismaProduct({
      brandId: brand.id,
    })

    const image = await imageFactory.makePrismaImage()

    await productImageFactory.makePrismaProductImage({
      productId: product.id,
      imageId: image.id,
    })

    const productId = product.id.toString()

    const productDetails = await productsRepository.findDetailsById(productId)

    const cached = await cacheRepository.get(`product:${productId}:details`)

    expect(cached).toEqual(JSON.stringify(productDetails))
  })

  it('should return cached product details on subsequent calls', async () => {
    const brand = await brandFactory.makePrismaBrand()

    const product = await productFactory.makePrismaProduct({
      brandId: brand.id,
    })

    const image = await imageFactory.makePrismaImage()

    await productImageFactory.makePrismaProductImage({
      productId: product.id,
      imageId: image.id,
    })

    const productId = product.id.toString()

    await cacheRepository.set(
      `product:${productId}:details`,
      JSON.stringify({ empty: true }),
    )

    const productDetails = await productsRepository.findDetailsById(productId)

    expect(productDetails).toEqual({ empty: true })
  })

  it('should reset product details cache when saving the product', async () => {
    const brand = await brandFactory.makePrismaBrand()

    const product = await productFactory.makePrismaProduct({
      brandId: brand.id,
    })

    const image = await imageFactory.makePrismaImage()

    await productImageFactory.makePrismaProductImage({
      productId: product.id,
      imageId: image.id,
    })

    const productId = product.id.toString()

    await cacheRepository.set(
      `product:${productId}:details`,
      JSON.stringify({ empty: true }),
    )

    await productsRepository.save(product)

    const cached = await cacheRepository.get(`product:${productId}:details`)

    expect(cached).toBeNull()
  })
})

import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { InMemoryProductImagesRepository } from 'test/repositories/in-memory-product-images-repository'
import { ProductStatus } from '../../enterprise/entities/value-objects/product-status'
import { GetProductUseCase } from './get-product'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { InMemoryBrandsRepository } from 'test/repositories/in-memory-brands-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { makeBrand } from 'test/factories/make-brand'
import { makeImage } from 'test/factories/make-image'
import { makeProductImage } from 'test/factories/make-product-image'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryProductCategoriesRepository } from 'test/repositories/in-memory-product-categories-repository'

describe('Get product', () => {
  let inMemoryProductCategoriesRepository: InMemoryProductCategoriesRepository
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository
  let inMemoryProductImagesRepository: InMemoryProductImagesRepository
  let inMemoryProductsRepository: InMemoryProductsRepository
  let inMemoryBrandsRepository: InMemoryBrandsRepository
  let inMemoryImagesRepository: InMemoryImagesRepository
  let sut: GetProductUseCase

  beforeEach(() => {
    inMemoryProductCategoriesRepository =
      new InMemoryProductCategoriesRepository()
    inMemoryProductImagesRepository = new InMemoryProductImagesRepository()
    inMemoryBrandsRepository = new InMemoryBrandsRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemoryProductImagesRepository,
      inMemoryBrandsRepository,
      inMemoryImagesRepository,
      inMemoryProductCategoriesRepository,
      inMemoryCategoriesRepository,
    )
    sut = new GetProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to get active product when is not admin', async () => {
    const brand = makeBrand()
    inMemoryBrandsRepository.create(brand)

    const image = makeImage({
      title: 'an image',
    })
    inMemoryImagesRepository.create(image)

    const product = makeProduct({
      status: ProductStatus.create('ACTIVE'),
      brandId: brand.id,
    })
    inMemoryProductsRepository.create(product)

    const productImage = makeProductImage({
      productId: product.id,
      imageId: image.id,
    })
    inMemoryProductImagesRepository.items.push(productImage)

    const result = await sut.execute({
      id: product.id.toString(),
      isAdmin: false,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryProductsRepository.items[0]).toEqual(product)
    }
  })

  it('should be able to get disabled product when is admin', async () => {
    const brand = makeBrand()
    inMemoryBrandsRepository.create(brand)

    const image = makeImage({
      title: 'an image',
    })
    inMemoryImagesRepository.create(image)

    const product = makeProduct({
      status: ProductStatus.create('DISABLED'),
      brandId: brand.id,
    })

    inMemoryProductsRepository.create(product)

    const productImage = makeProductImage({
      productId: product.id,
      imageId: image.id,
    })
    inMemoryProductImagesRepository.items.push(productImage)

    const result = await sut.execute({
      id: product.id.toString(),
      isAdmin: true,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryProductsRepository.items[0]).toEqual(product)
    }
  })

  it('should not be able to get disabled product when is not admin', async () => {
    const brand = makeBrand()
    inMemoryBrandsRepository.create(brand)

    const image = makeImage({
      title: 'an image',
    })
    inMemoryImagesRepository.create(image)

    const product = makeProduct({
      status: ProductStatus.create('DISABLED'),
      brandId: brand.id,
    })

    inMemoryProductsRepository.create(product)

    const productImage = makeProductImage({
      productId: product.id,
      imageId: image.id,
    })
    inMemoryProductImagesRepository.items.push(productImage)

    const result = await sut.execute({
      id: product.id.toString(),
      isAdmin: false,
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })
})

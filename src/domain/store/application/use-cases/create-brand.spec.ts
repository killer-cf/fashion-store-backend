import { InMemoryBrandsRepository } from 'test/repositories/in-memory-brands-repository'
import { CreateBrandUseCase } from './create-brand'
import { Brand } from '../../enterprise/entities/brand'

describe('Create Brand', () => {
  let inMemoryBrandsRepository: InMemoryBrandsRepository
  let sut: CreateBrandUseCase

  beforeEach(() => {
    inMemoryBrandsRepository = new InMemoryBrandsRepository()
    sut = new CreateBrandUseCase(inMemoryBrandsRepository)
  })

  it('should be able to create a brand', async () => {
    const result = await sut.execute({
      name: 'Xiaomi',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryBrandsRepository.items[0]).toEqual(result.value?.brand)
    }
  })

  it('should not be able to duplicate a brand', async () => {
    const brand = Brand.create({ name: 'Xiaomi' })
    inMemoryBrandsRepository.create(brand)

    const result = await sut.execute({
      name: 'xiaomi',
    })

    expect(result.isLeft()).toBe(true)
  })
})

import { InMemoryBrandsRepository } from 'test/repositories/in-memory-brands-repository'
import { ListBrandsUseCase } from './list-brands'
import { makeBrand } from 'test/factories/make-brand'

describe('List Brands', () => {
  let inMemoryBrandsRepository: InMemoryBrandsRepository
  let sut: ListBrandsUseCase

  beforeEach(() => {
    inMemoryBrandsRepository = new InMemoryBrandsRepository()
    sut = new ListBrandsUseCase(inMemoryBrandsRepository)
  })

  it('should be able to list brands', async () => {
    inMemoryBrandsRepository.create(makeBrand())
    inMemoryBrandsRepository.create(makeBrand())

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryBrandsRepository.items).toHaveLength(2)
  })

  it('should be able to list paginated brands', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryBrandsRepository.create(
        makeBrand({
          name: `Brand ${i}`,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.brands).toHaveLength(2)
    expect(result.value?.brands).toEqual([
      expect.objectContaining({ name: 'Brand 21' }),
      expect.objectContaining({ name: 'Brand 22' }),
    ])
  })
})

import { InMemoryBrandsRepository } from 'test/repositories/in-memory-brands-repository'
import { CreateBrandUseCase } from './create-brand'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { Brand } from '../../enterprise/entities/brand'

describe('Create Brand', () => {
  let inMemoryAdminsRepository: InMemoryAdminsRepository
  let inMemoryBrandsRepository: InMemoryBrandsRepository
  let sut: CreateBrandUseCase

  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryBrandsRepository = new InMemoryBrandsRepository()
    sut = new CreateBrandUseCase(
      inMemoryBrandsRepository,
      inMemoryAdminsRepository,
    )
  })

  it('should be able to create a brand', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      name: 'Xiaomi',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryBrandsRepository.items[0]).toEqual(result.value?.brand)
    }
  })

  it('should not be able to duplicate a brand', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.create(admin)

    const brand = Brand.create({ name: 'Xiaomi' })
    inMemoryBrandsRepository.create(brand)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      name: 'xiaomi',
    })

    expect(result.isLeft()).toBe(true)
  })
})

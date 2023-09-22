import { Either, left, right } from '@/core/either'
import { Brand } from '../../enterprise/entities/brand'
import { BrandsRepository } from '../repositories/brands-repository'
import { Injectable } from '@nestjs/common'
import { AdminsRepository } from '../repositories/admins-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { BrandAlreadyExistsError } from './errors/brand-already-exists-error'

interface CreateBrandUseCaseRequest {
  adminId: string
  name: string
}

type CreateBrandUseCaseResponse = Either<
  BrandAlreadyExistsError | NotAllowedError,
  {
    brand: Brand
  }
>

@Injectable()
export class CreateBrandUseCase {
  constructor(
    private brandsRepository: BrandsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    name,
  }: CreateBrandUseCaseRequest): Promise<CreateBrandUseCaseResponse> {
    const admin = this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new NotAllowedError())
    }

    const brandOnRepository = await this.brandsRepository.findByName(name)

    if (brandOnRepository) {
      return left(new BrandAlreadyExistsError())
    }

    const brand = Brand.create({
      name,
    })

    await this.brandsRepository.create(brand)

    return right({ brand })
  }
}

import { Either, left, right } from '@/core/either'
import { Brand } from '../../enterprise/entities/brand'
import { BrandsRepository } from '../repositories/brands-repository'
import { Injectable } from '@nestjs/common'
import { BrandAlreadyExistsError } from './errors/brand-already-exists-error'

interface CreateBrandUseCaseRequest {
  name: string
}

type CreateBrandUseCaseResponse = Either<
  BrandAlreadyExistsError,
  {
    brand: Brand
  }
>

@Injectable()
export class CreateBrandUseCase {
  constructor(private brandsRepository: BrandsRepository) {}

  async execute({
    name,
  }: CreateBrandUseCaseRequest): Promise<CreateBrandUseCaseResponse> {
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

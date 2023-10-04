import { Either, right } from '@/core/either'
import { Brand } from '../../enterprise/entities/brand'
import { BrandsRepository } from '../repositories/brands-repository'
import { Injectable } from '@nestjs/common'

interface ListBrandsUseCaseRequest {
  page: number
}

type ListBrandsUseCaseResponse = Either<
  null,
  {
    brands: Brand[]
  }
>

@Injectable()
export class ListBrandsUseCase {
  constructor(private brandsRepository: BrandsRepository) {}

  async execute({
    page,
  }: ListBrandsUseCaseRequest): Promise<ListBrandsUseCaseResponse> {
    const brands = await this.brandsRepository.listAll(page)

    return right({ brands })
  }
}

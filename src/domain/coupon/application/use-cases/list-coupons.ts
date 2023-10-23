import { Either, right } from '@/core/either'
import { Coupon } from '../../enterprise/entities/coupon'
import { CouponsRepository } from '../repositories/coupons-repository'
import { Injectable } from '@nestjs/common'

interface ListCouponsUseCaseRequest {
  page: number
}

type ListCouponsUseCaseResponse = Either<
  null,
  {
    coupons: Coupon[]
  }
>

@Injectable()
export class ListCouponsUseCase {
  constructor(private couponsRepository: CouponsRepository) {}

  async execute({
    page,
  }: ListCouponsUseCaseRequest): Promise<ListCouponsUseCaseResponse> {
    const coupons = await this.couponsRepository.findMany({ page })

    return right({ coupons })
  }
}

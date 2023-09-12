import { HashComparer } from '@/domain/store/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/store/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { hash, compare } from 'bcrypt'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  hash(plain: string): Promise<string> {
    return hash(plain, 8)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}

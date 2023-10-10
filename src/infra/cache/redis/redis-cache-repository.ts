import { Injectable } from '@nestjs/common'
import { CacheRepository } from '../cache-repository'
import { RedisService } from './redis.service'

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', 60 * 20)
  }

  async get(key: string): Promise<string | null> {
    const data = await this.redis.get(key)
    return data
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }
}

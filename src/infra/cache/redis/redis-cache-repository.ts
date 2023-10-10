import { CacheRepository } from '../cache-repository'
import { RedisService } from './redis.service'

export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async get(key: string): Promise<string | null> {
    throw new Error('Method not implemented.')
  }

  async delete(key: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

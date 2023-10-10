import { EnvService } from '@/infra/env/env.service'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(envService: EnvService) {
    const host = envService.get('REDIS_HOST')
    const port = Number(envService.get('REDIS_PORT'))
    const db = Number(envService.get('REDIS_DB'))

    super({
      host,
      port,
      db,
    })
  }

  onModuleDestroy() {
    return this.disconnect()
  }
}

import { Module } from '@nestjs/common'
import { StoreControllersModule } from './controllers/store/store-controllers.module'

@Module({
  imports: [StoreControllersModule],
})
export class HttpModule {}

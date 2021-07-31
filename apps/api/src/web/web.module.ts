import { BullModule } from '@nestjs/bull';
import { CacheModule, Module } from '@nestjs/common';
import { YtdlModule } from '../ytdl/ytdl.module';

import { WebController } from './web.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'vidgrab',
    }),
    CacheModule.register(),
    YtdlModule,
  ],
  controllers: [WebController],
})
export class WebModule {}

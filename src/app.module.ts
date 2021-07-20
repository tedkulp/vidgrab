import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { WebModule } from './web/web.module';
import { YtdlModule } from './ytdl/ytdl.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
      prefix: 'vgqueue',
    }),
    YtdlModule,
    WebModule,
  ],
})
export class AppModule {}

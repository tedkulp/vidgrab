import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { YtdlModule } from '../ytdl/ytdl.module';

import { WebController } from './web.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'vidgrab',
    }),
    YtdlModule,
  ],
  controllers: [WebController],
})
export class WebModule {}

import { Module } from '@nestjs/common';
import { YtdlService } from './ytdl.service';
import { YtdlProcessor } from './ytdl.processor';

@Module({
  providers: [YtdlProcessor, YtdlService],
  exports: [YtdlProcessor, YtdlService],
})
export class YtdlModule {}

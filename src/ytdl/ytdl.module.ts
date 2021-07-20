import { Module } from '@nestjs/common';

import { YtdlProcessor } from './ytdl.processor';
import { YtdlService } from './ytdl.service';

@Module({
  providers: [YtdlProcessor, YtdlService],
  exports: [YtdlProcessor, YtdlService],
})
export class YtdlModule {}

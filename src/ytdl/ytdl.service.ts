import { Injectable, Logger } from '@nestjs/common';
import { default as ytdl } from 'youtube-dl-exec';

@Injectable()
export class YtdlService {
  private readonly logger = new Logger(YtdlService.name);

  async getVideoInfo(url: string) {
    return ytdl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
    });
  }
}

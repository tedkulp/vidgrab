import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Req,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { pick, trimEnd } from 'lodash';

import { QueueDto, UploadDto } from '@vidgrab/api-interfaces';
import { YtdlService } from '../ytdl/ytdl.service';

@Controller()
export class WebController {
  private readonly logger = new Logger(WebController.name);

  constructor(
    @InjectQueue('vidgrab') private readonly vidgrabQueue: Queue,
    private readonly ytdlService: YtdlService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  @Get('/info')
  // @Render('Index')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async root(@Req() request: any) {
    const fullUrl = this.configService.get('siteUrl') ||
      request.protocol + '://' + request.get('host') + request.originalUrl;
    const bookmarklet = `javascript:(function(){var xhr=new XMLHttpRequest();xhr.open('POST',encodeURI('${trimEnd(
      fullUrl,
      '/',
    )}'));xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');xhr.send('url='+document.location.href.replace(/ /g,'+'));}());`;

    const jobs = await this.vidgrabQueue.getJobs([
      'completed',
      'waiting',
      'active',
      'delayed',
      'failed',
      'paused',
    ]);

    const jobList = await Promise.all(
      jobs.map(async (j) => {
        const state = await j.getState();
        const progress = j.progress();

        return {
          ...pick(j, ['id', 'name', 'data']),
          progress: progress ? `${progress}%` : 'n/a',
          state: state,
        };
      }),
    );

    return {
      bookmarklet,
      jobs: JSON.parse(
        JSON.stringify(
          jobList
            .sort(
              (a: {id: string}, b: { id: string }) => parseInt(b.id.toString()) - parseInt(a.id.toString()),
            )
            .slice(0, 10),
        ),
      ),
    };
  }

  @Get('/extractors')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(600)
  async listExtractors() {
    const extractors = await this.ytdlService.listExtractors();

    return {
      extractors,
    };
  }

  @Post('/getinfo')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInfo(@Body() body: UploadDto) {
    const videoInfo = await this.ytdlService.getVideoInfo(body.url);

    return {
      title: videoInfo.title,
      extractor: videoInfo.extractor,
      description: videoInfo.description,
      videoUrl: videoInfo.webpage_url,
      thumbnails: videoInfo.thumbnails,
      upload_date: videoInfo.upload_date,
      duration: videoInfo.duration,
      formats: videoInfo.formats.map((f) =>
        pick(f, ['format_id', 'format', 'filesize', 'format_note', 'ext']),
      ),
    };
  }

  @Post('/queue')
  @UsePipes(new ValidationPipe({ transform: true }))
  async queue(@Body() body: QueueDto) {
    if (!body.extractor || !body.title) {
      const videoInfo = await this.ytdlService.getVideoInfo(body.url);
      body.extractor = videoInfo.extractor;
      body.title = videoInfo.title;
    }

    const job = await this.vidgrabQueue.add('download', body);

    this.eventEmitter.emit('job.added', { job });

    return {
      jobId: job.id,
    };
  }
}

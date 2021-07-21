import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Redirect,
  Render,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Queue } from 'bull';
import { pick, trimEnd } from 'lodash';
import { YtdlService } from 'src/ytdl/ytdl.service';

import { QueueDto, UploadDto } from '../types';

@Controller()
export class WebController {
  private readonly logger = new Logger(WebController.name);

  constructor(
    @InjectQueue('vidgrab') private readonly vidgrabQueue: Queue,
    private readonly ytdlService: YtdlService,
  ) {}

  @Get()
  @Render('index')
  async root(@Req() request: any) {
    const fullUrl =
      request.protocol + '://' + request.get('host') + request.originalUrl;
    const bookmarklet = `javascript:(function(){var xhr=new XMLHttpRequest();xhr.open('POST',encodeURI('${trimEnd(
      fullUrl,
      '/',
    )}/queue'));xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');xhr.send('url='+document.location.href.replace(/\ /g,'+'));}());`;

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
          ...j,
          progress: progress ? `${progress}%` : 'n/a',
          state: state,
        };
      }),
    );

    return {
      bookmarklet,
      jobs: jobList
        .sort((a, b) => parseInt(b.id.toString()) - parseInt(a.id.toString()))
        .slice(0, 10),
    };
  }

  @Get('/extractors')
  @Render('extractors')
  async listExtractors() {
    const extractors = await this.ytdlService.listExtractors();

    return {
      extractors,
    };
  }

  @Post('/getinfo')
  @Render('getinfo')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInfo(@Body() body: UploadDto) {
    const videoInfo = await this.ytdlService.getVideoInfo(body.url);

    return {
      title: videoInfo.title,
      extractor: videoInfo.extractor,
      description: videoInfo.description,
      url: videoInfo.webpage_url,
      thumbnails: videoInfo.thumbnails,
      upload_date: videoInfo.upload_date,
      duration: videoInfo.duration,
      formats: videoInfo.formats.map((f) =>
        pick(f, ['format_id', 'format', 'filesize', 'format_note', 'ext']),
      ),
    };
  }

  @Post('/queue')
  @Redirect('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async queue(@Body() body: QueueDto) {
    if (!body.extractor || !body.title) {
      const videoInfo = await this.ytdlService.getVideoInfo(body.url);
      body.extractor = videoInfo.extractor;
      body.title = videoInfo.title;
    }

    const job = await this.vidgrabQueue.add('download', body);

    return {
      jobId: job.id,
    };
  }
}

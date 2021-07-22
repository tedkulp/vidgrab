import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { throttle } from 'lodash';
import split from 'split2';
import { QueueDto } from 'src/types';
import { raw } from 'youtube-dl-exec';

@Processor('vidgrab')
export class YtdlProcessor {
  private readonly logger = new Logger(YtdlProcessor.name);
  private setProgress = throttle((job: Job, progress: number) => {
    job.progress(progress);
  }, 250);

  constructor(private readonly configService: ConfigService) {}

  @Process('download')
  async handleDownload(job: Job<QueueDto>) {
    this.logger.debug('Start downloading...');
    this.logger.debug(job.data);

    try {
      const execaProcess = raw(job.data.url, {
        format: job.data.format,
        output: `${this.configService.get(
          'fileDir',
        )}/%(title)s-%(format_id)s.%(ext)s`,
        newline: true,
      });

      execaProcess.stdout?.pipe(split()).on('data', (line: string) => {
        this.logger.verbose(`youtube-dl stdout: ${line}`);

        const percentDone = line.match(/\[download\]\s+([0-9.]+)% of/);
        if (percentDone) {
          this.setProgress(job, parseFloat(percentDone[1]));
        }
      });

      execaProcess.stderr?.pipe(split()).on('data', (line: any) => {
        this.logger.error(`youtube-dl stderr: ${line}`);
      });

      await execaProcess.then();
    } catch (err) {
      this.logger.error(err);
    }

    this.logger.debug('Downloading completed');
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )}...`,
    );
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )} and result ${result}...`,
    );
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )} and error ${err}...`,
    );
  }

  @OnQueueError()
  onError(err: Error) {
    this.logger.error(`Error is ${err}...`);
  }

  @OnQueueProgress()
  onProgress(job: Job, progress: number) {
    this.logger.verbose(
      `Progress on ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )} and progress ${progress}...`,
    );
  }
}

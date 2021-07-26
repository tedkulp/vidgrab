export class UploadDto {
  url = '';
}

export class QueueDto {
  format? = 'best';
  url = '';
  title?: string;
  extractor?: string;
}

export type JobEvent = {
  job?: any;
  err?: Error;
};

export class UploadDto {
  url: string;
}

export class QueueDto {
  format? = 'best';
  url: string;
  title?: string;
  extractor?: string;
}

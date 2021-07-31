export interface Message {
  message: string;
}

export interface UploadDto {
  url: string;
}

export interface QueueDto {
  format: string;
  url: string;
  title?: string;
  extractor?: string;
}

export type JobEvent = {
  job?: unknown;
  err?: Error;
};

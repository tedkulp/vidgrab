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

export interface JobEvent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  job?: any;
  err?: Error;
};

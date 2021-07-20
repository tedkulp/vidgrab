import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from './config/configuration';
import { WebModule } from './web/web.module';
import { YtdlModule } from './ytdl/ytdl.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [configuration],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('redisHost'),
          port: configService.get('redisPort'),
        },
        prefix: 'vgqueue',
      }),
      inject: [ConfigService],
    }),
    YtdlModule,
    WebModule,
  ],
})
export class AppModule {}

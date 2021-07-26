import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { RenderModule } from 'nest-next';
import Next from 'next';

import configuration from './config/configuration';
import { JobGateway } from './job.gateway';
import { WebModule } from './web/web.module';
import { YtdlModule } from './ytdl/ytdl.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [configuration],
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    ScheduleModule.forRoot(),
    RenderModule.forRootAsync(
      Next({ dev: process.env.NODE_ENV !== 'production' }),
    ),
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
  providers: [JobGateway],
})
export class AppModule {}

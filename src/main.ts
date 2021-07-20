import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as exphbs from 'express-handlebars';
import { capitalize, truncate } from 'lodash';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: join(__dirname, '..', 'views', 'layouts'),
    helpers: {
      capitalize,
      truncate: (str: string, options: any) => truncate(str, options.hash),
    },
    extname: '.hbs',
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine('.hbs', hbs.engine);
  app.setViewEngine('.hbs');

  await app.listen(3000);
}
bootstrap();

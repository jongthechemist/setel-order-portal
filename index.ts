import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';

import { AppModule } from './src/app.module';

const expressServer = express();

const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.enableCors();
  await app.init();
};

export const api = functions
  .region('us-central1')
  .https.onRequest(async (request, response) => {
    await createFunction(expressServer);
    expressServer(request, response);
  });

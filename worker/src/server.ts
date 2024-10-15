import { app } from './app'
import { env } from './shared/env'
import logger from 'm-node-logger'
import makeTestBroker from './modules/consumer/services/TestBroker';
import AppError from './shared/errors/AppError';

makeTestBroker().execute().then((result: boolean) => {
  app.listen({
    host: '0.0.0.0',
    port: env.PORT,
  });

  logger.info('HTTP Server Running');
  logger.info('Running on port:', env.PORT);
}).catch((err: AppError) => {
  logger.info(`Message broker connection: FAIL`);
  throw `Unable to start services without Message Broker enabled`;
});
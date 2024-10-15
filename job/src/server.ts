import { app } from './app'
import { env } from './shared/env'
import logger from 'm-node-logger'
import { schedule } from 'node-cron';

app.listen({
  host: '0.0.0.0',
  port: env.PORT,
});

logger.info('HTTP Server Running');
logger.info('Running on port:', env.PORT);
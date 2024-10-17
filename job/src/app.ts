import express from 'express'
import routes from './shared/routes'
import logger from 'm-node-logger'

const swagger = require('swagger-ui-express');
const swaggerDoc = require('../swagger-output.json');

const app = express();

logger.init({
  path: 'logs',
  level_error: true,
  level_warning: true,
  daily: true
});

app.use('/api-docs', swagger.serve);
app.get('/api-docs', swagger.setup(swaggerDoc));

app.use(express.json());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-ignore
app.use((req, res, next) => {

  const label = 'Request for ' + req.url + ' from ' + req.ip;
  logger.time(label);

  next();

  logger.timeEnd(label);
})

app.use(routes)

export { app }

import 'dotenv/config'
import z from 'zod';
import logger from 'm-node-logger'

const envSchema = z.object({
  PORT: z.string(),
  API_CLIENT_URL: z.string(),
  API_SALES_URL: z.string(),
  API_PRODUCT_URL: z.string(),
  API_BROKER_URL: z.string(),
  BROKER_QUEUE: z.string()
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  logger.error('❌ Invalid enviroment variables', _env.error.format())

  throw new Error('Invalid enviroment variables')
}

export const env = _env.data

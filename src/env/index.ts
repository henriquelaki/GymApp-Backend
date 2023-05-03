import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  PORT: z.coerce.number().positive().default(3333),
  PAGINATION_LIMIT: z.coerce.number().positive().default(20),
  MAX_KILOMETER_DISTANCE: z.coerce.number().positive().default(10),
  MAX_CHECK_IN_VALIDATION_TIME_IN_MINUTES: z.coerce
    .number()
    .positive()
    .default(20),
  JWT_SECRET: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data

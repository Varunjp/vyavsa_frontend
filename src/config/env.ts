import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default('Vyavsa Bill Book'),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:8080/api/v1'),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional().default(''),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email().default('vyavsa.support@gmail.com'),
  NEXT_PUBLIC_SUPPORT_PHONE: z.string().default('9447651431'),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  NEXT_PUBLIC_SUPPORT_PHONE: process.env.NEXT_PUBLIC_SUPPORT_PHONE,
});

if (!parsed.success) {
  console.error('Invalid environment variables configuration:', parsed.error.format());
}

export const env = parsed.success
  ? parsed.data
  : {
      NEXT_PUBLIC_APP_NAME: 'Vyavsa Bill Book',
      NEXT_PUBLIC_APP_ENV: 'development' as const,
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      NEXT_PUBLIC_API_URL: 'http://localhost:8080/api/v1',
      NEXT_PUBLIC_RAZORPAY_KEY_ID: '',
      NEXT_PUBLIC_SUPPORT_EMAIL: 'vyavsa.support@gmail.com',
      NEXT_PUBLIC_SUPPORT_PHONE: '9447651431',
    };

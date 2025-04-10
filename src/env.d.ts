
// Environment variable type definitions
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    VITE_SUPABASE_URL: string
    VITE_SUPABASE_ANON_KEY: string
    VITE_SENTRY_DSN: string
  }
}

interface ImportMeta {
  env: {
    MODE: string;
    DEV: boolean;
    PROD: boolean;
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_SENTRY_DSN: string;
  };
}

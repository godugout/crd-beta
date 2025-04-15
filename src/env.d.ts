
// Environment variable type definitions
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    VITE_SUPABASE_URL: string
    VITE_SUPABASE_ANON_KEY: string
    VITE_SENTRY_DSN: string
    VITE_GRAPHQL_API_URL: string
    VITE_GRAPHQL_WS_URL: string
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
    VITE_GRAPHQL_API_URL?: string;
    VITE_GRAPHQL_WS_URL?: string;
  };
}

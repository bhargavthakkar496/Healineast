/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { typedRoutes: true },
  // Bakes env vars into server bundle at build time – fixes Amplify Lambda not receiving runtime env
  serverRuntimeConfig: {
    AUTH_DATABASE_URL: process.env.AUTH_DATABASE_URL,
    AUTH_DB_URL: process.env.AUTH_DB_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_DB_HOST: process.env.AUTH_DB_HOST,
    AUTH_DB_PORT: process.env.AUTH_DB_PORT,
    AUTH_DB_NAME: process.env.AUTH_DB_NAME,
    AUTH_DB_USER: process.env.AUTH_DB_USER,
    AUTH_DB_PASSWORD: process.env.AUTH_DB_PASSWORD,
    AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
    AUTH_DB_SSL: process.env.AUTH_DB_SSL,
    AUTH_DB_SSL_REJECT_UNAUTHORIZED: process.env.AUTH_DB_SSL_REJECT_UNAUTHORIZED,
  },
};
export default nextConfig;

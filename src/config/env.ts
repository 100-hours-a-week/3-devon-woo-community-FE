interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_AI_API_BASE_URL: string
  readonly VITE_USE_MOCK: string
  readonly VITE_CLOUDINARY_CLOUD_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export const ENV = import.meta.env.MODE
export const isDev = import.meta.env.DEV
export const isProd = import.meta.env.PROD

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
export const AI_API_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL || API_BASE_URL
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'

export const env = {
  ENV,
  isDev,
  isProd,
  API_BASE_URL,
  AI_API_BASE_URL,
  USE_MOCK,
  CLOUDINARY_CLOUD_NAME,
}

export default env

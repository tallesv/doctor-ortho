/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROJECT_ID: string;
  readonly VITE_PROJECT_NUMBER: string;
  readonly VITE_WEB_API_KEY: string;
  readonly VITE_AUTH_DOMAIN: string;
  readonly VITE_STORAGE_BUCKET: string;
  readonly VITE_APP_ID: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

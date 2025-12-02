declare global {
  interface Window {
    kakao: any;
  }
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_MAP_KEY: string;
  // 다른 VITE_ 환경변수도 필요하면 여기에 추가
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


export {};

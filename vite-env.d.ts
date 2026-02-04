/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SIGHTENGINE_USER: string
    readonly VITE_SIGHTENGINE_SECRET: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

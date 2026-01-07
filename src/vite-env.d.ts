/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*?as=metadata' {
  const src: {
    src: string
    width: number
    height: number
  }
  export default src
}

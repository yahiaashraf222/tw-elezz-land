/// <reference types="vite/client" />

declare module '@salla.sa/twilight-bundles/vite-plugins' {
  import { Plugin } from 'vite';
  export function sallaTransformPlugin(): Plugin;
  export function sallaBuildPlugin(): Plugin;
  export function sallaDemoPlugin(options?: any): Plugin;
}

/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module 'virtual:keyline-icons' {
  import type { IconifyJSON } from '@iconify/types';

  const collection: IconifyJSON;
  export default collection;
}

import { defineConfig, type Plugin } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from '@tailwindcss/vite';
import wails from "@wailsio/runtime/plugins/vite";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { wuchale } from 'wuchale/vite'

const require = createRequire(import.meta.url);
const KEYLINE_PREFIX = "keyline-icons";
const VIRTUAL_ID = `virtual:${KEYLINE_PREFIX}`;
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(svelte|ts)$/.test(name) ? [path] : [];
  });
}

// The Keyline collection ships 10k icons (6MB of JSON) and this is an offline desktop app,
// so only the names actually referenced in src/ are bundled and served from the icon storage.
function keylineIcons(): Plugin {
  const srcDir = fileURLToPath(new URL("src", import.meta.url));
  return {
    name: KEYLINE_PREFIX,
    resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : null),
    load(id) {
      if (id !== RESOLVED_ID) return null;

      const used = new Set<string>();
      for (const file of sourceFiles(srcDir)) {
        this.addWatchFile(file);
        const pattern = new RegExp(`${KEYLINE_PREFIX}:([a-z0-9]+(?:-[a-z0-9]+)*)`, "g");
        for (const match of readFileSync(file, "utf8").matchAll(pattern)) used.add(match[1]);
      }

      const collection = JSON.parse(
        readFileSync(require.resolve(`@iconify-json/${KEYLINE_PREFIX}/icons.json`), "utf8")
      );
      const icons: Record<string, unknown> = {};
      for (const name of used) {
        if (collection.icons[name]) icons[name] = collection.icons[name];
        else this.warn(`keyline-icons:${name} is not part of the Keyline collection`);
      }

      return `export default ${JSON.stringify({
        prefix: collection.prefix,
        icons,
        height: collection.height,
        width: collection.width,
      })};`;
    },
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(srcDir)) return;
      const module = server.moduleGraph.getModuleById(RESOLVED_ID);
      if (module) server.moduleGraph.invalidateModule(module);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: Number(process.env.WAILS_VITE_PORT) || 9245,
    strictPort: true,
  },
  plugins: [tailwindcss(), wuchale(), keylineIcons(), svelte(), wails("./bindings")],
});

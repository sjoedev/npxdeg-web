// @ts-check
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      BUNNY_DATABASE_URL: envField.string({ context: "server", access: "public" }),
      BUNNY_DATABASE_AUTH_TOKEN: envField.string({ context: "server", access: "secret" }),
      BUNNY_STORAGE_BASE_URL: envField.string({ context: "server", access: "public" }),
    },
  },
});

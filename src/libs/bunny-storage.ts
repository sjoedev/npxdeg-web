import { BUNNY_STORAGE_BASE_URL } from "astro:env/server";

export const storage = {
  itemUrl: (path: string): string => `${BUNNY_STORAGE_BASE_URL}${path}`,
};

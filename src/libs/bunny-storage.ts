import { BUNNY_STORAGE_BASE_URL } from "astro:env/client";

type ImageSize = "thumb" | "preview" | "main";

export const storage = {
  plantImageUrl: (id: string, size: ImageSize): string => `${BUNNY_STORAGE_BASE_URL}/${id}.${size}.webp`,
};

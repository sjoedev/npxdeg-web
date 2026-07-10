import { createClient } from "@libsql/client/node";
import { BUNNY_DATABASE_AUTH_TOKEN, BUNNY_DATABASE_URL } from "astro:env/server";

export const db = createClient({
  url: BUNNY_DATABASE_URL,
  authToken: BUNNY_DATABASE_AUTH_TOKEN,
});

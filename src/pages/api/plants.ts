import type { APIRoute } from "astro";
import { PLANT_PAGE_SIZE } from "../../constants";
import { db } from "../../libs/bunny-db";
import { PlantSchema } from "../../schema";

export const GET: APIRoute = async ({ url }) => {
  const cursor = Number(url.searchParams.get("cursor") ?? "0");
  if (isNaN(cursor)) {
    return new Response("invalid cursor", {
      status: 400,
    });
  }

  const sql = `
    SELECT
      id,
      common_name as commonName,
      slug,
      binomial,
      image_id as imageId,
      updated_at as updatedAt
    FROM plant
    WHERE id > ?
    ORDER BY id ASC
    LIMIT ?
  `;

  const res = await db.execute({
    sql,
    args: [cursor, PLANT_PAGE_SIZE + 1],
  });

  let more = res.rows.length > PLANT_PAGE_SIZE;
  let rows = res.rows;
  if (more) {
    rows = rows.slice(0, PLANT_PAGE_SIZE);
  }

  const plants = rows.map((row) => PlantSchema.parse(row));

  return new Response(
    JSON.stringify({
      plants,
      more,
    }),
    {
      status: 200,
    },
  );
};

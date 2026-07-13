import { z } from "astro/zod";
import { useState } from "preact/hooks";
import { storage } from "../libs/bunny-storage";
import { PlantCardSchema, type PlantCard } from "../schema";

type Props = {
  seed: Array<PlantCard>;
  more: boolean;
};

export const LoadPlants = (props: Props) => {
  const [plants, setPlants] = useState<Array<PlantCard>>(props.seed);
  const [more, setMore] = useState(props.more);
  const [cursor, setCursor] = useState(props.seed.at(-1)?.id ?? 0);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/plants?cursor=${cursor}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("load plants failed");
      }

      const body = await res.json();
      const plants = z.array(PlantCardSchema).parse(body.plants);

      setPlants((prev) => [...prev, ...plants]);

      setCursor((prev) => plants.at(-1)?.id ?? prev);
      setMore(z.boolean().parse(body.more));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div class="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 xl:grid-cols-6">
        {plants.map((p) => (
          <div
            key={p.id}
            class="border-2"
          >
            {p.imageId && (
              <img
                src={storage.plantImageUrl(p.imageId, "thumb")}
                alt={p.commonName}
                class="aspect-video w-full object-cover select-none"
              />
            )}

            {!p.imageId && (
              <div class="flex aspect-video items-center justify-center bg-neutral-200 text-neutral-700 italic select-none">
                No Image
              </div>
            )}

            <div class="p-2 text-sm">
              <div class="font-bold">{p.commonName}</div>
              <div class="mb-2 text-neutral-700">{p.binomial}</div>
              <a
                href={`/plants/${p.slug}`}
                class="block w-fit underline"
              >
                Learn More
              </a>
            </div>
          </div>
        ))}
      </div>

      {more && (
        <button
          class="mt-4 h-12 w-full cursor-pointer bg-black text-white select-none"
          onClick={async () => await loadMore()}
          disabled={loading}
        >
          Load More
        </button>
      )}
    </div>
  );
};

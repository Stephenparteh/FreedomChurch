
import { PageHero } from "@/components/shared/PageHero";
import { usePageMeta } from "@/hooks/usePageMeta";
import { MinistriesList } from "@/components/sections/ministries/MinistriesList";

export function Ministries() {
  usePageMeta(
    "Ministries",
    "Explore the ministries you can join or support at NFPC.",
  );

  return (
    <>
      <PageHero
        title="Our ministries."
        description="Find a place to serve, grow, and belong."
      />

      <MinistriesList />
    </>
  );
}
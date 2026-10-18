import { PageHero } from "@/components/shared/PageHero";
import { usePageMeta } from "@/hooks/usePageMeta";
import { GalleryList } from "@/components/sections/gallery/GalleryList";

export function Gallery() {
  usePageMeta("Gallery", "Photos from services and church life at NFPC.");

  return (
    <>
      <PageHero
        title="Gallery"
        description="Glimpses of worship, fellowship, and church life."
      />

      <GalleryList />
    </>
  );
}

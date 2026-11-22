import Image from "next/image";

import type { BlogPost } from "../blog-listing.types";

import {
  storyExplorerPanelVariants,
  storyExplorerMediaVariants,
  storyExplorerMediaImageVariants,
  storyExplorerMediaLayerVariants,
  storyExplorerMediaFallbackVariants,
  storyExplorerMediaCaptionVariants,
  storyExplorerMediaCountVariants,
} from "./story-explorer.variants";

export type StoryExplorerMediaEntry = {
  id: BlogPost["id"];
  title: BlogPost["preview"]["title"];
  image: BlogPost["preview"]["image"];
};

type StoryExplorerMediaProps = {
  stories: readonly StoryExplorerMediaEntry[];
  activeIndex: number;
  label: string;
};

export function StoryExplorerMedia({
  stories,
  activeIndex,
  label,
}: StoryExplorerMediaProps) {
  return (
    <div aria-hidden="true" className={storyExplorerPanelVariants()}>
      <div className={storyExplorerMediaVariants()}>
        {stories.map((story, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={story.id}
              className={storyExplorerMediaLayerVariants({
                active: isActive,
              })}
            >
              {story.image ? (
                <Image
                  src={story.image.src}
                  alt=""
                  fill
                  sizes="(min-width: 1440px) 640px, 45vw"
                  loading="lazy"
                  className={storyExplorerMediaImageVariants()}
                />
              ) : (
                <div className={storyExplorerMediaFallbackVariants()}>
                  <span className="max-w-sm text-3xl font-semibold tracking-tight">
                    {story.title}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={storyExplorerMediaCaptionVariants()}>
        <span>{label}</span>

        <span className={storyExplorerMediaCountVariants()}>
          {String(activeIndex + 1).padStart(2, "0")}

          <span className="mx-2 text-brand-bronze">/</span>

          {String(stories.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  StoryExplorerMedia,
  type StoryExplorerMediaEntry,
} from "./StoryExplorerMedia";

import { createStoryExplorerController } from "./story-explorer.animations";

import { storyExplorerLayoutVariants } from "./story-explorer.variants";

type StoryExplorerClientProps = {
  children: ReactNode;
  stories: readonly StoryExplorerMediaEntry[];
  mediaLabel: string;
};

export function StoryExplorerClient({
  children,
  stories,
  mediaLabel,
}: StoryExplorerClientProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const storyCount = stories.length;

  const safeIndex = Math.min(activeIndex, Math.max(0, storyCount - 1));

  useEffect(() => {
    const root = rootRef.current;

    if (!root || storyCount < 2) {
      return;
    }

    return createStoryExplorerController({
      root,
      onActiveChange: setActiveIndex,
    });
  }, [storyCount]);

  return (
    <div ref={rootRef} className={storyExplorerLayoutVariants()}>
      {children}

      {storyCount > 0 && (
        <StoryExplorerMedia
          stories={stories}
          activeIndex={safeIndex}
          label={mediaLabel}
        />
      )}
    </div>
  );
}

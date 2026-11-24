import Image from "next/image";

import { Link } from "@/i18n/navigation";

import type { BlogPost, BlogStoryLabels } from "../blog-listing.types";

import {
  storyExplorerItemVariants,
  storyExplorerItemLinkVariants,
  storyExplorerItemNumberVariants,
  storyExplorerItemContentVariants,
  storyExplorerItemMetaVariants,
  storyExplorerItemTitleVariants,
  storyExplorerItemDescriptionVariants,
  storyExplorerItemCtaVariants,
  storyExplorerItemArrowVariants,
  storyExplorerMobileMediaVariants,
} from "./story-explorer.variants";

type StoryExplorerItemProps = {
  article: BlogPost;
  labels: BlogStoryLabels;
  index: number;
};

export function StoryExplorerItem({
  article,
  labels,
  index,
}: StoryExplorerItemProps) {
  const { id, slug, preview, publishedAt } = article;

  const image = preview.image;

  const titleId = `story-explorer-title-${id}`;
  const readId = `story-explorer-read-${id}`;

  return (
    <li data-story-explorer-item className={storyExplorerItemVariants()}>
      <article>
        <Link
          href={`/blog/${slug}`}
          prefetch={false}
          className={storyExplorerItemLinkVariants()}
        >
          <span
            aria-hidden="true"
            className={storyExplorerItemNumberVariants()}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className={storyExplorerItemContentVariants()}>
            {image && (
              <div className={storyExplorerMobileMediaVariants()}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 640px) 80vw, 85vw"
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
            )}

            <div className={storyExplorerItemMetaVariants()}>
              <span>{labels.category}</span>

              <span aria-hidden="true">·</span>

              <time dateTime={publishedAt}>{labels.date}</time>
            </div>

            <h3 id={titleId} className={storyExplorerItemTitleVariants()}>
              {preview.title}
            </h3>

            <p className={storyExplorerItemDescriptionVariants()}>
              {preview.description}
            </p>

            <div className={storyExplorerItemCtaVariants()}>
              <span id={readId}>{labels.read}</span>

              <span
                aria-hidden="true"
                className={storyExplorerItemArrowVariants()}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  focusable="false"
                  className="size-4"
                >
                  <path d="M5 19 19 5M7 5h12v12" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      </article>
    </li>
  );
}

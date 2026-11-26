import { getArticlePath } from "@/lib/content/content-paths";
import { Link } from "@/i18n/navigation";

import {
  relatedPostsItemVariants,
  relatedPostsItemNumberVariants,
  relatedPostsItemContentVariants,
  relatedPostsItemMetaVariants,
  relatedPostsItemMetaSeparatorVariants,
  relatedPostsItemTitleVariants,
  relatedPostsItemDescriptionVariants,
  relatedPostsItemIconVariants,
  relatedPostsItemArrowVariants,
} from "./related-posts.variants";

import type { RelatedPostsItemProps } from "./types";

export function RelatedPostsItem({
  post,
  index,
  categoryLabel,
  formattedDate,
}: RelatedPostsItemProps) {
  const { id, preview, publishedAt, slug } = post;

  const titleId = `related-post-title-${id}`;

  return (
    <li>
      <Link
        href={getArticlePath(slug)}
        prefetch={false}
        aria-labelledby={titleId}
        className={relatedPostsItemVariants()}
      >
        <span aria-hidden="true" className={relatedPostsItemNumberVariants()}>
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className={relatedPostsItemContentVariants()}>
          <div className={relatedPostsItemMetaVariants()}>
            <span>{categoryLabel}</span>

            <span
              aria-hidden="true"
              className={relatedPostsItemMetaSeparatorVariants()}
            />

            <time dateTime={publishedAt}>{formattedDate}</time>
          </div>

          <h3 id={titleId} className={relatedPostsItemTitleVariants()}>
            {preview.title}
          </h3>

          <p className={relatedPostsItemDescriptionVariants()}>
            {preview.description}
          </p>
        </div>

        <span aria-hidden="true" className={relatedPostsItemIconVariants()}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            focusable="false"
            className={relatedPostsItemArrowVariants()}
          >
            <path d="M5 19 19 5M7 5h12v12" />
          </svg>
        </span>
      </Link>
    </li>
  );
}

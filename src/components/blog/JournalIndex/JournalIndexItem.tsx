import { Link } from "@/i18n/navigation";

import type { BlogPost, BlogStoryLabels } from "../blog-listing.types";

import {
  journalIndexItemLinkVariants,
  journalIndexItemNumberVariants,
  journalIndexItemContentVariants,
  journalIndexItemMetaVariants,
  journalIndexItemTitleVariants,
  journalIndexItemArrowVariants,
} from "./journal-index.variants";

type JournalIndexItemProps = {
  article: BlogPost;
  labels: Omit<BlogStoryLabels, "read">;
  index: number;
};

export function JournalIndexItem({
  article,
  labels,
  index,
}: JournalIndexItemProps) {
  const { id, slug, publishedAt, preview } = article;

  const titleId = `journal-index-item-${id}`;

  return (
    <li>
      <article>
        <Link
          href={`/blog/${slug}`}
          prefetch={false}
          aria-labelledby={titleId}
          className={journalIndexItemLinkVariants()}
        >
          <span aria-hidden="true" className={journalIndexItemNumberVariants()}>
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className={journalIndexItemContentVariants()}>
            <div className={journalIndexItemMetaVariants()}>
              <span>{labels.category}</span>

              <span aria-hidden="true">·</span>

              <time dateTime={publishedAt}>{labels.date}</time>
            </div>

            <h3 id={titleId} className={journalIndexItemTitleVariants()}>
              {preview.title}
            </h3>
          </div>

          <span aria-hidden="true" className={journalIndexItemArrowVariants()}>
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
        </Link>
      </article>
    </li>
  );
}

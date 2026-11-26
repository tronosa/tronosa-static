import { getServerLocale } from "@/i18n/get-server-locale";
import { getArticlePath } from "@/lib/content/content-paths";
import Image from "next/image";

import { Link } from "@/i18n/navigation";

import type { BlogPost, BlogStoryLabels } from "../blog-listing.types";

import {
  featuredChapterLinkVariants,
  featuredChapterVisualVariants,
  featuredChapterMediaVariants,
  featuredChapterImageVariants,
  featuredChapterMediaFrameVariants,
  featuredChapterMediaFooterVariants,
  featuredChapterMediaLabelVariants,
  featuredChapterMediaAccentVariants,
  featuredChapterContentVariants,
  featuredChapterNumberRowVariants,
  featuredChapterNumberVariants,
  featuredChapterNumberLineVariants,
  featuredChapterMetaVariants,
  featuredChapterMetaSeparatorVariants,
  featuredChapterTitleVariants,
  featuredChapterDescriptionVariants,
  featuredChapterCtaVariants,
  featuredChapterIconVariants,
  featuredChapterArrowVariants,
} from "./featured-chapter.variants";

type FeaturedChapterArticleProps = {
  article: BlogPost;
  labels: BlogStoryLabels;
  journalLabel: string;
};

export async function FeaturedChapterArticle({
  article,
  labels,
  journalLabel,
}: FeaturedChapterArticleProps) {
  const locale = await getServerLocale();

  const { id, slug, preview, publishedAt } = article;

  const image = preview.image;
  const hasImage = Boolean(image);

  const titleId = `featured-chapter-title-${id}`;
  const readId = `featured-chapter-read-${id}`;

  return (
    <article>
      <Link
        href={getArticlePath(locale, slug)}
        prefetch={false}
        className={featuredChapterLinkVariants({
          hasImage,
        })}
      >
        {image && (
          <div className={featuredChapterVisualVariants()}>
            <div className={featuredChapterMediaVariants()}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1440px) 760px, (min-width: 1024px) 52vw, 100vw"
                loading="lazy"
                className={featuredChapterImageVariants()}
              />

              <span
                aria-hidden="true"
                className={featuredChapterMediaFrameVariants()}
              />
            </div>

            <div
              aria-hidden="true"
              className={featuredChapterMediaFooterVariants()}
            >
              <span className={featuredChapterMediaLabelVariants()}>
                {journalLabel}
              </span>

              <span className={featuredChapterMediaAccentVariants()} />
            </div>
          </div>
        )}

        <div
          className={featuredChapterContentVariants({
            hasImage,
          })}
        >
          <div
            aria-hidden="true"
            className={featuredChapterNumberRowVariants()}
          >
            <span className={featuredChapterNumberVariants()}>01.</span>

            <span className={featuredChapterNumberLineVariants()} />
          </div>

          <div className={featuredChapterMetaVariants()}>
            <span>{labels.category}</span>

            <span
              aria-hidden="true"
              className={featuredChapterMetaSeparatorVariants()}
            />

            <time dateTime={publishedAt}>{labels.date}</time>
          </div>

          <h3 id={titleId} className={featuredChapterTitleVariants()}>
            {preview.title}
          </h3>

          <p className={featuredChapterDescriptionVariants()}>
            {preview.description}
          </p>

          <div className={featuredChapterCtaVariants()}>
            <span id={readId}>{labels.read}</span>

            <span aria-hidden="true" className={featuredChapterIconVariants()}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                focusable="false"
                className={featuredChapterArrowVariants()}
              >
                <path d="M5 19 19 5M7 5h12v12" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

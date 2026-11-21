import Image from "next/image";

import {
  articleAuthorVariants,
  articleAuthorAvatarVariants,
  articleAuthorImageVariants,
  articleAuthorInitialsVariants,
  articleAuthorContentVariants,
  articleAuthorNameVariants,
  articleAuthorLinkVariants,
  articleMetadataLabelVariants,
} from "./article-metadata.variants";

import { getAuthorInitials } from "./article-metadata.utils";

import type { ArticleAuthorProps } from "./types";

export function ArticleAuthor({ author, locale, label }: ArticleAuthorProps) {
  const initials = getAuthorInitials(author.name, locale);

  return (
    <div className={articleAuthorVariants()}>
      <div aria-hidden="true" className={articleAuthorAvatarVariants()}>
        {author.image ? (
          <Image
            src={author.image}
            alt=""
            fill
            sizes="64px"
            loading="lazy"
            className={articleAuthorImageVariants()}
          />
        ) : (
          <span className={articleAuthorInitialsVariants()}>{initials}</span>
        )}
      </div>

      <div className={articleAuthorContentVariants()}>
        <span className={articleMetadataLabelVariants()}>{label}</span>

        <span className={articleAuthorNameVariants()}>
          {author.url ? (
            <a href={author.url} className={articleAuthorLinkVariants()}>
              {author.name}
            </a>
          ) : (
            author.name
          )}
        </span>
      </div>
    </div>
  );
}

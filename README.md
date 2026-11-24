# Tronoša — Website

Multilingual corporate and editorial website built with Next.js, with a focus on performance, accessibility, search engine optimization, maintainability, and operational reliability.

The website uses version-controlled JSON content and statically generated pages. Content changes are published through the normal Git and deployment workflow without a CMS or database.

## Technology Stack

| Technology                     | Purpose                                          |
| ------------------------------ | ------------------------------------------------ |
| Next.js 16.4.6                 | Application framework and static page generation |
| React 19.3.0                   | Server and client components                     |
| TypeScript                     | Static type safety                               |
| Tailwind CSS                   | Styling and design tokens                        |
| Class Variance Authority (CVA) | Component styles and variants                    |
| Radix UI                       | Accessible interactive component primitives      |
| Zod                            | Content validation                               |
| next-intl                      | Internationalization                             |
| GSAP                           | Animation and interactive experiences            |
| MapLibre GL JS                 | Interactive distribution map                     |
| Swiper                         | Interactive card slider                          |
| ImageKit                       | Optional image CDN and transformations           |
| Vitest                         | Unit and integration testing                     |
| V8 Coverage                    | Automated test coverage measurement              |
| Playwright                     | End-to-end browser testing                       |
| axe-core                       | Automated accessibility testing                  |
| Lighthouse CI                  | Performance and quality measurement              |
| ESLint                         | Static code analysis                             |
| Prettier                       | Consistent code formatting                       |
| Husky                          | Automated Git quality gates                      |
| Gitleaks                       | Secret detection                                 |
| Docker                         | Containerized reliability testing                |
| Nginx                          | Reverse proxy and load balancing                 |
| Grafana k6                     | Load and stress testing                          |
| Netlify                        | Target hosting platform                          |
| pnpm 12.6.0                    | Package management                               |

## Engineering Principles

- Performance-first architecture.
- Accessibility-first component development.
- Server Components by default.
- Static generation whenever applicable.
- Minimal client-side JavaScript.
- Route-specific resource loading.
- Centralized content validation.
- Reusable and maintainable components.
- Consistent design system.
- Automated quality verification.
- Evidence-driven performance engineering.
- Environment-specific deployment behavior.
- Deterministic content processing.
- No unnecessary runtime dependencies.
- Preservation of existing functionality during optimization.

## Getting Started

### Prerequisites

- Node.js (version specified by the repository or CI configuration).
- pnpm 12.6.0.
- Git.
- Gitleaks for mandatory pre-commit secret detection.
- Grafana k6 for standalone reliability testing.
- Docker Desktop with Docker Compose for containerized reliability testing.

Verify installed tools:

```bash
node --version
pnpm --version
git --version
gitleaks version
docker --version
docker compose version
k6 version
```

### Package Manager

Install the required pnpm version using Corepack, where available:

```bash
corepack enable
corepack prepare pnpm@12.6.0 --activate
```

### Installation

Install project dependencies:

```bash
pnpm install --frozen-lockfile
```

Install Playwright browsers:

```bash
pnpm exec playwright install
```

Initialize Git hooks if necessary:

```bash
pnpm prepare
```

## Environment Configuration

Configure local environment variables inside `.env.local` when required.

### Development Environment

```dotenv
APP_ENV=development
SITE_URL=http://localhost:3000
SEO_INDEXING_ENABLED=false
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
```

### Staging Environment

```dotenv
APP_ENV=staging
SITE_URL=https://example.com
SEO_INDEXING_ENABLED=false
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
```

Replace the example origin with the actual staging deployment origin when configuring a deployed staging environment.

### Production Environment

```dotenv
APP_ENV=production
SITE_URL=https://tronosa.com
SEO_INDEXING_ENABLED=true
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
```

Enable production indexing only when the website is ready for public indexing.

### Environment Variables

| Variable                            | Description                                                 |
| ----------------------------------- | ----------------------------------------------------------- |
| `APP_ENV`                           | Application environment: development, staging or production |
| `SITE_URL`                          | Absolute website origin                                     |
| `SEO_INDEXING_ENABLED`              | Explicit search engine indexing configuration               |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | Optional ImageKit project endpoint                          |

### Environment Validation

Environment validation is centralized in:

```text
src/lib/environment.ts
```

The environment configuration enforces the following rules:

- Development is the default environment.
- Unsupported application environments are rejected.
- SITE_URL is required in staging and production.
- SITE_URL must use HTTP or HTTPS.
- Production SITE_URL must use HTTPS.
- SITE_URL must represent a valid origin.
- Paths other than the root path are not allowed.
- Query parameters are not allowed.
- URL fragments are not allowed.
- URL credentials are not allowed.
- Search engine indexing is enabled only when APP_ENV is production and SEO_INDEXING_ENABLED is explicitly true.

### Environment Guidelines

- Never commit secrets or machine-specific configuration.
- Never expose secrets through NEXT_PUBLIC variables.
- Keep development, staging and production environments separate.
- Use the actual production origin for canonical URLs.
- Allow Next.js to configure NODE_ENV automatically.
- Follow the existing environment validation rules.
- Configure environment variables before generating static pages.
- Rebuild the application when build-time environment configuration changes.

A production-mode Next.js runtime does not automatically imply that search engine indexing is enabled.

## Development

Start the development server:

```bash
pnpm dev
```

Application URL:

```text
http://localhost:3000
```

## Production Build

Generate a production build:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

Always verify production behavior before opening a pull request or deploying a release.

Development-server behavior is not a substitute for production verification.

### Test Build

Generate a production-mode build using staging SEO policies:

```bash
pnpm build:test
```

Start the test build:

```bash
pnpm start:test
```

The test build uses:

```dotenv
APP_ENV=staging
SITE_URL=https://example.com
SEO_INDEXING_ENABLED=false
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
```

The test environment intentionally disables search engine indexing and excludes language alternate metadata.

## Project Architecture

The following structure represents the primary architectural areas of the application.

```text
src/
├── app/
├── components/
│   ├── ui/
│   ├── media/
│   └── sections/
│       ├── registries/
│       ├── section-context.ts
│       ├── section-registry.ts
│       └── section-renderer.tsx
├── content/
│   ├── config/
│   ├── pages/
│   │   ├── en/
│   │   ├── sr-Cyrl/
│   │   └── sr-Latn/
│   ├── blog/
│   │   ├── en/
│   │   ├── sr-Cyrl/
│   │   └── sr-Latn/
│   └── schemas/
├── dictionaries/
├── i18n/
└── lib/
    ├── animation/
    ├── content/
    ├── media/
    ├── security/
    └── seo/
        └── structured-data/

public/
└── assets/

tests/
├── unit/
│   ├── content/
│   ├── sections/
│   └── seo/
├── integration/
├── e2e/
└── reliability/
```

### Architectural Responsibilities

| Directory                        | Responsibility                                      |
| -------------------------------- | --------------------------------------------------- |
| `app`                            | Application routing, layouts and metadata endpoints |
| `components/ui`                  | Reusable design-system components                   |
| `components/media`               | Media components and validation schemas             |
| `components/sections`            | JSON-driven page sections                           |
| `components/sections/registries` | Typed section rendering registries                  |
| `content/config`                 | Centralized website configuration                   |
| `content/pages`                  | Localized standard pages and blog listings          |
| `content/blog`                   | Localized editorial article content                 |
| `content/schemas`                | Content validation schemas                          |
| `dictionaries`                   | Localized interface translations                    |
| `i18n`                           | Internationalization configuration and routing      |
| `lib/content`                    | Content registry, validation and retrieval          |
| `lib/seo`                        | Metadata, canonical URLs and indexability           |
| `lib/seo/structured-data`        | JSON-LD generation                                  |
| `lib/animation`                  | Shared animation infrastructure                     |
| `lib/media`                      | Media URL resolution                                |
| `lib/security`                   | Content Security Policy and security headers        |
| `public/assets`                  | Public static assets                                |
| `tests`                          | Automated testing infrastructure                    |

## Component Architecture

Components follow established naming and organization conventions.

Example:

```text
ArticleHero/
├── ArticleHero.tsx
├── ArticleHeroBackground.tsx
├── article-hero.schema.ts
├── article-hero.variants.ts
├── types.ts
└── index.ts
```

### Component Guidelines

- Use PascalCase for component directories.
- Use PascalCase for React component filenames.
- Use kebab-case for schema and variants filenames.
- Define component types inside types.ts.
- Use explicit public exports through index.ts.
- Use CVA for component variants.
- Reuse existing UI primitives.
- Keep presentation separate from content retrieval.
- Introduce Client Components only when interaction requires them.
- Preserve server-rendered content whenever applicable.
- Isolate third-party runtime dependencies when beneficial.
- Avoid unnecessary abstraction and duplicated functionality.
- Preserve existing accessibility behavior during refactoring.
- Keep new section tests outside component directories.

New section tests should be placed under:

```text
tests/unit/sections/
```

New content-related tests should be placed under:

```text
tests/unit/content/
```

Existing colocated tests remain supported.

## Internationalization

The application supports three locales.

| Locale    | Language         | Home URL   |
| --------- | ---------------- | ---------- |
| `sr-Cyrl` | Serbian Cyrillic | `/`        |
| `sr-Latn` | Serbian Latin    | `/sr-Latn` |
| `en`      | English          | `/en`      |

Serbian Cyrillic is the default locale.

The default locale uses unprefixed public URLs. Other locales retain their corresponding URL prefix.

### Localized Route Examples

| Page    | Serbian Cyrillic | Serbian Latin          | English           |
| ------- | ---------------- | ---------------------- | ----------------- |
| Home    | `/`              | `/sr-Latn`             | `/en`             |
| Blog    | `/blog`          | `/sr-Latn/blog`        | `/en/blog`        |
| Article | `/blog/[slug]`   | `/sr-Latn/blog/[slug]` | `/en/blog/[slug]` |

The explicit default locale prefix is normalized to its unprefixed equivalent.

### Localization Requirements

- Localized page content.
- Localized article content.
- Localized navigation.
- Localized metadata.
- Localized accessibility labels.
- Locale-specific URLs.
- Eligible language alternate links.
- Stable content identifiers across translations.
- Localized interface dictionaries.

Translations must share the same stable content ID while allowing different localized slugs.

Use the existing locale-aware navigation utilities instead of manually constructing localized navigation links where possible.

## Content Management

The website uses a JSON-driven content architecture.

Content is validated using Zod and managed through a centralized Content Registry.

A CMS and database are not required.

### Content Flow

```text
JSON Content
    |
    v
Schema Validation
    |
    v
Content Registry
    |
    v
Section Validation
    |
    v
Section Context
    |
    v
Section Registry
    |
    v
Section Renderer
    |
    v
Generated Page
```

### Content Registry

The Content Registry is responsible for discovering, reading, validating and retrieving content.

Location:

```text
src/lib/content/registry.ts
```

The registry operates on two content kinds:

- page
- article

Available content methods include:

| Method                     | Responsibility                                             |
| -------------------------- | ---------------------------------------------------------- |
| `getContentRegistry()`     | Retrieve validated content                                 |
| `getContentById()`         | Retrieve content by kind, locale and stable ID             |
| `getContentBySlug()`       | Retrieve content by kind, locale and slug                  |
| `getPublishedContent()`    | Retrieve pages and published articles                      |
| `getPublishedPosts()`      | Retrieve published articles with optional locale filtering |
| `getPublishedPostBySlug()` | Retrieve a published article by locale and slug            |
| `getFeaturedPost()`        | Retrieve the featured article                              |
| `getRelatedPosts()`        | Retrieve related articles                                  |

### Content Registry Validation

The registry validates:

- JSON content structure.
- Supported content schemas.
- Content identifiers.
- Public URL uniqueness.
- Content identity uniqueness.
- Slug format.
- Reserved page slugs.
- Default home page slug requirements.
- Blog listing slug requirements.
- Duplicate section identifiers.
- Singleton section restrictions.
- Section references.
- Locale-specific content references.

Filesystem operations must remain centralized within the Content Registry.

Individual presentation components must not directly access the filesystem.

### Content Identity

Content identity is determined by:

```text
content kind + locale + content ID
```

The same content ID may exist across multiple locales.

Duplicate identities within the same content kind and locale are rejected.

Different content entries must not generate duplicate public URLs.

## Section Architecture

The section architecture separates shared sections, blog listing sections and article-specific sections.

### Section Registries

```text
src/components/sections/
├── registries/
│   ├── shared.registry.tsx
│   ├── blog.registry.tsx
│   ├── article.registry.tsx
│   └── types.ts
├── section-context.ts
├── section-registry.ts
└── section-renderer.tsx
```

Each registry defines rendering handlers for its supported section types.

The unified section registry combines these handlers without removing their content boundaries.

### Section Context

Section contexts provide content-specific information to rendering handlers.

Supported contexts include:

| Context  | Responsibility                                    |
| -------- | ------------------------------------------------- |
| Standard | Standard page rendering                           |
| Blog     | Blog listing composition and editorial sections   |
| Article  | Article-specific data and calculated reading time |

Context is created once per rendering operation rather than being independently reconstructed by every section.

### Section Validation Rules

- Standard pages may use shared sections.
- Blog listing pages may use shared and blog-specific sections.
- Article pages may use shared and article-specific sections.
- Blog-specific sections cannot be used on standard or article pages.
- Article-specific sections cannot be used on standard or blog listing pages.
- Section identifiers must be unique within a content entry.
- Singleton sections must not appear multiple times.
- Referenced pages must exist in the appropriate locale.

## Blog and Editorial System

The blog is designed as a modular editorial experience rather than a traditional card-based blog.

Articles are stored as localized JSON files.

Adding new article content does not require creating a new React page or manually registering an article.

Content becomes available through the normal Git and deployment workflow.

### Blog Listing Composition

The editorial listing consists of:

- Journal introduction.
- Featured article.
- Story exploration.
- Remaining article archive.
- Closing editorial section.

Articles are distributed between editorial sections without unnecessary duplication.

The composition selects an explicitly featured article where available, followed by the configured story exploration selection and remaining archive content.

Empty listings are handled without rendering duplicate empty-state messages.

### Article Fields

| Field                 | Description                        |
| --------------------- | ---------------------------------- |
| `id`                  | Stable content identifier          |
| `slug`                | Localized URL segment              |
| `status`              | Publication status                 |
| `createdAt`           | Content creation timestamp         |
| `modifiedAt`          | Last modification timestamp        |
| `publishedAt`         | Publication timestamp              |
| `category`            | Article category                   |
| `featured`            | Featured article eligibility       |
| `author`              | Article author                     |
| `author.type`         | Person or Organization             |
| `author.name`         | Required author name               |
| `author.url`          | Optional author identification URL |
| `author.image`        | Optional author image              |
| `preview.title`       | Article preview title              |
| `preview.description` | Article preview description        |
| `preview.image`       | Optional article preview image     |
| `seo`                 | Search engine metadata             |
| `content.sections`    | Ordered article sections           |

### Publication Status

Supported publication statuses:

```text
draft
published
```

Draft articles may be retrieved through internal content registry queries.

Draft articles are excluded from:

- Published article queries.
- Public article routes.
- Blog listings.
- Featured article selection.
- Related article selection.
- Sitemap generation.
- Eligible language alternate references.

Draft status controls application publication behavior. It must not be treated as a confidentiality or access-control mechanism for content stored in a repository.

### Article Categories

| Identifier       | Purpose                          |
| ---------------- | -------------------------------- |
| `nature`         | Nature and natural origin        |
| `hydration`      | Hydration and water consumption  |
| `health`         | Health-related editorial content |
| `sustainability` | Environmental responsibility     |
| `company`        | Company-related stories          |
| `news`           | Announcements and news           |

### Article Author

The article author is required.

Supported author types:

```text
Person
Organization
```

The default author type is Person.

For company-authored articles, explicitly use Organization.

Minimal company author configuration:

```json
{
  "author": {
    "type": "Organization",
    "name": "Tronoša"
  }
}
```

Extended author configuration:

```json
{
  "author": {
    "type": "Organization",
    "name": "Tronoša",
    "url": "https://tronosa.com",
    "image": "/assets/logo/logo.webp"
  }
}
```

The optional identification URL provides additional author information through structured data.

The optional image can be used in the article author presentation.

### Article Dates

Dates must use valid ISO 8601 timestamps with a timezone offset or Z.

```json
{
  "createdAt": "2026-11-20T10:00:00+01:00",
  "publishedAt": "2026-11-20T12:00:00+01:00",
  "modifiedAt": "2026-11-20T13:00:00+01:00"
}
```

Date responsibilities:

- createdAt represents content creation.
- publishedAt represents public publication.
- modifiedAt represents the most recent modification.

All three timestamps are required by the current article schema.

### Date Validation

For all articles:

```text
modifiedAt >= createdAt
```

For published articles:

```text
createdAt <= publishedAt <= modifiedAt
```

Draft articles do not enforce publication ordering restrictions.

Date comparisons use parsed timestamps rather than lexical string comparison, allowing equivalent timestamps with different timezone offsets.

### Article Ordering

Published articles are sorted by:

1. Publication timestamp, descending.
2. Article ID, ascending, as a deterministic tie-breaker.

Ordering must not depend on filesystem enumeration order or JSON filenames.

### Featured Articles

Featured article selection prioritizes explicitly featured published articles.

If multiple published articles are marked as featured, the latest article according to the established publication ordering is selected.

If no article is explicitly featured, the latest published article is selected.

If no published articles exist for the requested locale, no featured article is returned.

### Related Articles

Related article selection is handled automatically by the Content Registry.

The algorithm:

1. Retrieves published articles in the current locale.
2. Identifies the currently viewed article.
3. Excludes the current article.
4. Prioritizes articles from the same category.
5. Preserves publication ordering within category priority groups.
6. Falls back to articles from other categories.
7. Applies the configured result limit.

Draft articles and articles from other locales are excluded.

The default related article limit is three.

Add the following section to the end of the article's content.sections array, typically after the sharing section:

```json
{
  "id": "related-posts",
  "type": "related-posts",
  "content": {
    "limit": 3
  }
}
```

Supported limit range:

```text
1–10
```

Related article slugs and IDs do not need to be maintained manually.

### Reading Time

Article reading time is calculated automatically from supported editorial text.

The calculation uses locale-aware word segmentation and an estimated reading speed of 200 words per minute.

Reading time is derived from the article content rather than manually maintained in JSON.

The article context calculates reading time when the corresponding metadata section requires it.

## Editorial Components

The following editorial section types are implemented.

### Blog Listing Sections

| Section type       | Responsibility                                  |
| ------------------ | ----------------------------------------------- |
| `journal-opening`  | Blog listing introduction                       |
| `featured-chapter` | Featured editorial article                      |
| `story-explorer`   | Curated article exploration                     |
| `journal-index`    | Remaining published article archive             |
| `source-closing`   | Closing section with a validated page reference |

### Article Sections

| Section type       | Responsibility                           |
| ------------------ | ---------------------------------------- |
| `article-hero`     | Individual article introduction          |
| `article-metadata` | Author, dates and estimated reading time |
| `article-image`    | Editorial image and optional caption     |
| `content-section`  | Structured textual content               |
| `share-article`    | Localized article sharing controls       |
| `related-posts`    | Related article recommendations          |

Shared sections are also available wherever permitted by the content schema.

ArticleQuote and ArticleHighlight are not currently registered editorial section types. They must not be configured until implemented and validated.

### Editorial Layout

Article content should prioritize readability.

Recommended content widths:

| Width  | Maximum Width   | Purpose                        |
| ------ | --------------- | ------------------------------ |
| Narrow | 42rem           | Paragraphs and textual content |
| Medium | 56rem           | Extended editorial content     |
| Wide   | 64rem           | Images and visual sections     |
| Full   | Available width | Hero and full-width sections   |

These widths are editorial design recommendations rather than a guarantee that every component uses the same dimensions.

Article images support the following layout configurations:

```text
reading
medium
wide
```

The default article image layout is wide.

### Article Image Example

```json
{
  "id": "natural-source-image",
  "type": "article-image",
  "content": {
    "src": "/assets/images/placeholder.webp",
    "alt": "Natural spring water source",
    "width": 1200,
    "height": 800,
    "caption": "Water originating from nature.",
    "layout": "wide",
    "priority": false
  }
}
```

Article image validation requires:

- A nonempty image source.
- A supported source prefix.
- Nonempty alternative text.
- Positive integer dimensions.
- A supported layout.
- A boolean loading priority value.

Image sources are expected to use local paths or HTTPS URLs.

The schema prefix check is not a complete URL security validator. Final media URL verification remains part of the release process.

Nonessential editorial images should not be assigned high loading priority.

## Rich Text

Rich text uses structured JSON rather than raw HTML.

### Supported Formatting

- Plain text.
- Bold.
- Italic.
- Underline.
- Design-system colors.
- Semantic headings.
- Paragraphs.
- Ordered lists.
- Unordered lists.

Example:

```json
{
  "type": "paragraph",
  "children": [
    {
      "text": "Natural mineral water "
    },
    {
      "text": "Tronosa",
      "bold": true,
      "color": "primary"
    },
    {
      "text": " originates in nature."
    }
  ]
}
```

### Rich Text Guidelines

- Do not use dangerouslySetInnerHTML for editorial rich text.
- Preserve semantic HTML.
- Preserve whitespace between text fragments.
- Reuse existing typography styles.
- Avoid unnecessary DOM elements.
- Maintain accessible color contrast.
- Avoid introducing unnecessary client-side hydration.

## ArticleHero

ArticleHero is a server-rendered editorial section with configurable appearance, decorative concentric rings and localized background text.

The appearance configuration follows the same CSS custom property approach used by ProductShowcase.

### Appearance Properties

| Property          | Responsibility                     |
| ----------------- | ---------------------------------- |
| `backgroundColor` | Hero background color              |
| `accentColor`     | Decorative concentric ring color   |
| `backgroundText`  | Localized decorative wordmark      |
| `title`           | Optional formatted article heading |

Both color values must use six-digit hexadecimal notation.

### CSS Custom Properties

```css
--article-background
--article-accent
```

The decorative background text uses the following styling:

```text
select-none whitespace-nowrap
text-[clamp(3rem,19vw,24rem)]
font-bold leading-none
tracking-[-0.08em]
text-white/45
```

The decorative wordmark and concentric rings must remain hidden from assistive technology.

### Color Presets

The following palettes are proposed editorial appearance combinations.

| Preset          | Background | Accent  |
| --------------- | ---------- | ------- |
| Forest Green    | #174B37    | #A8C9AA |
| Deep Ocean      | #234D65    | #8CCDE3 |
| Olive Nature    | #4A5141    | #D4CE9A |
| Mountain Shadow | #25373B    | #FFFFFF |
| Natural Earth   | #75543B    | #D2AE84 |
| Deep Emerald    | #103D35    | #70BBA0 |
| Mineral Blue    | #193B52    | #91BED8 |
| Botanical Green | #344D32    | #BACD96 |
| Midnight Blue   | #192C49    | #819BC7 |
| Volcanic Stone  | #303432    | #B5BDB8 |
| Terracotta      | #754538    | #DBAD94 |
| Deep Burgundy   | #54313D    | #CDA1B0 |

### Forest Green

```json
{
  "backgroundColor": "#174B37",
  "accentColor": "#A8C9AA"
}
```

### Deep Ocean

```json
{
  "backgroundColor": "#234D65",
  "accentColor": "#8CCDE3"
}
```

### Olive Nature

```json
{
  "backgroundColor": "#4A5141",
  "accentColor": "#D4CE9A"
}
```

### Mountain Shadow

```json
{
  "backgroundColor": "#25373B",
  "accentColor": "#FFFFFF"
}
```

### Natural Earth

```json
{
  "backgroundColor": "#75543B",
  "accentColor": "#D2AE84"
}
```

### Deep Emerald

```json
{
  "backgroundColor": "#103D35",
  "accentColor": "#70BBA0"
}
```

### Mineral Blue

```json
{
  "backgroundColor": "#193B52",
  "accentColor": "#91BED8"
}
```

### Botanical Green

```json
{
  "backgroundColor": "#344D32",
  "accentColor": "#BACD96"
}
```

### Midnight Blue

```json
{
  "backgroundColor": "#192C49",
  "accentColor": "#819BC7"
}
```

### Volcanic Stone

```json
{
  "backgroundColor": "#303432",
  "accentColor": "#B5BDB8"
}
```

### Terracotta

```json
{
  "backgroundColor": "#754538",
  "accentColor": "#DBAD94"
}
```

### Deep Burgundy

```json
{
  "backgroundColor": "#54313D",
  "accentColor": "#CDA1B0"
}
```

### Recommended Palettes by Category

| Category       | Recommended Palettes           |
| -------------- | ------------------------------ |
| Nature         | Forest Green, Botanical Green  |
| Hydration      | Deep Ocean, Mineral Blue       |
| Health         | Deep Emerald, Olive Nature     |
| Sustainability | Botanical Green, Natural Earth |
| Company        | Midnight Blue, Mountain Shadow |
| News           | Volcanic Stone, Deep Burgundy  |

### Configuration Example

```json
{
  "id": "article-hero",
  "type": "article-hero",
  "content": {
    "backgroundText": "TRONOŠA",
    "appearance": {
      "backgroundColor": "#174B37",
      "accentColor": "#A8C9AA"
    }
  }
}
```

### Localized Background Text

| Locale  | Background Text |
| ------- | --------------- |
| sr-Latn | TRONOŠA         |
| sr-Cyrl | ТРОНОША         |
| en      | TRONOSA         |

### Responsive Behavior

| Device  | Minimum Height |
| ------- | -------------- |
| Mobile  | 40svh          |
| Tablet  | 40svh          |
| Desktop | 50svh          |

Minimum heights allow the section to expand naturally when content, translations or text zoom require additional space.

### Appearance Accessibility

- Maintain sufficient foreground contrast.
- Verify contrast against overlapping decorative elements.
- Normal text requires a minimum contrast ratio of 4.5:1.
- Large text requires a minimum contrast ratio of 3:1.
- Decorative elements must remain aria-hidden.
- Decorative elements must not receive keyboard focus.
- Decorative elements must not intercept pointer events.
- Adjust decorative opacity when necessary.

The provided palettes are design recommendations and require accessibility verification against the final rendered component.

## Search Engine Optimization

The website uses centralized SEO infrastructure.

Location:

```text
src/lib/seo/
```

### SEO Architecture

```text
src/lib/seo/
├── alternates.ts
├── config.ts
├── indexability.ts
├── metadata.ts
├── urls.ts
└── structured-data/
    ├── blog-posting.ts
    ├── breadcrumb.ts
    ├── index.ts
    ├── organization.ts
    ├── webpage.ts
    └── website.ts
```

### SEO Features

- Server-rendered HTML.
- Static page generation.
- Individual page metadata.
- Individual article metadata.
- Canonical URL generation.
- Canonical URL normalization.
- Canonical origin validation.
- Localized hreflang attributes.
- Reciprocal language alternatives.
- Conditional x-default references.
- Environment-specific indexing.
- XML sitemap.
- Robots configuration.
- Open Graph metadata.
- Twitter metadata.
- Article publication metadata.
- JSON-LD structured data.
- Semantic HTML.
- Localized URL structure.
- Publication and modification timestamps.

### Canonical URL Generation

Canonical URLs default to the public content URL.

Explicit canonical URLs are supported through the SEO configuration.

Relative canonical example:

```json
{
  "seo": {
    "canonical": "/en/about-us"
  }
}
```

Absolute canonical example:

```json
{
  "seo": {
    "canonical": "https://tronosa.com/en/about-us"
  }
}
```

An omitted, null or empty canonical value falls back to the public content URL.

Explicit canonical URLs are normalized before canonical identity comparisons.

### Canonical URL Validation

Canonical URL validation rejects:

- External origins.
- Unsupported origins and protocols.
- Different ports that change the origin.
- URL credentials.
- Nonempty query parameters.
- Nonempty fragments.
- Malformed absolute URLs.

Trailing slashes are normalized according to the application's canonical URL convention, with the root URL preserved.

Canonical URL validation does not automatically verify that every explicitly configured internal canonical target represents an existing published page. Content authors must ensure that canonical targets are appropriate.

### Canonical Identity

A content entry is considered self-canonical when its canonical URL matches its generated public content URL.

Self-canonical identity is used when determining eligibility for:

- Sitemap entries.
- Hreflang references.
- Language alternatives.

Content pointing to another valid internal canonical URL is excluded from canonical sitemap and language alternate selection.

### Indexability

Indexability is determined through separate content and environment rules.

Content-level eligibility considers:

- Content publication status.
- SEO index configuration.
- Canonical identity where applicable.

Environment-level indexing considers:

```text
APP_ENV=production
SEO_INDEXING_ENABLED=true
```

### Environment-Specific SEO Policy

| Feature                 | Development | Staging   | Production with indexing enabled |
| ----------------------- | ----------- | --------- | -------------------------------- |
| Canonical metadata      | Generated   | Generated | Generated                        |
| Search engine indexing  | Disabled    | Disabled  | Content-dependent                |
| Search engine following | Disabled    | Disabled  | Content-dependent                |
| Hreflang references     | Omitted     | Omitted   | Eligible translations            |
| x-default               | Omitted     | Omitted   | Eligible default translation     |
| Sitemap URL entries     | Empty       | Empty     | Eligible canonical content       |
| Structured data         | Generated   | Generated | Generated                        |

Production indexing also remains disabled when SEO_INDEXING_ENABLED is false.

The omission of language alternates in non-indexable environments is an intentional project policy, not a universal SEO requirement.

Robots directives are not access control.

Use appropriate deployment access protection if staging must remain private.

### Hreflang Generation

Language alternate references are generated from content entries that:

- Have the same content kind.
- Share the same stable content identifier.
- Are published or represent standard public pages.
- Are configured as indexable.
- Are self-canonical.

Localized slugs may differ between translated entries.

The x-default reference is generated only when an eligible default locale translation exists.

Entries that are not eligible for canonical indexing do not receive language alternate references.

### Sitemap Generation

The sitemap includes eligible public content when production indexing is enabled.

Sitemap generation excludes:

- Draft articles.
- Non-indexable content.
- Non-self-canonical content.
- Content excluded by environment indexing rules.

Where supported, modification timestamps are included in sitemap metadata.

Sitemap alternates and page metadata alternates must remain consistent.

### Structured Data

The JSON-LD infrastructure generates structured data according to the content type.

Supported schema types include:

| Schema Type    | Responsibility                      |
| -------------- | ----------------------------------- |
| Organization   | Company identification              |
| WebSite        | Website identification              |
| WebPage        | Standard public page representation |
| CollectionPage | Blog listing representation         |
| BreadcrumbList | Hierarchical page navigation        |
| BlogPosting    | Editorial article representation    |
| Person         | Individual article author           |
| Organization   | Company article author              |

Article structured data includes relevant publication, modification and author information.

### Social Metadata

The metadata infrastructure generates Open Graph and Twitter metadata.

Articles support a preview image fallback when an explicit Open Graph image is not configured.

Final social image URLs must be verified against deployed assets before production release.

### SEO Regression Testing

The SEO test suite verifies:

- Relative canonical URLs.
- Absolute canonical URLs.
- Explicit self-canonical URLs.
- Canonical origin validation.
- Canonical credentials rejection.
- Canonical query parameter rejection.
- Canonical fragment rejection.
- Localized URL generation.
- Reciprocal language alternates.
- Localized slug handling.
- Sitemap eligibility.
- Sitemap uniqueness.
- Metadata consistency.
- Structured data generation.
- Environment-specific indexing.

A regression test identified an issue where absolute canonical URLs were incorrectly interpreted as relative internal paths.

The URL resolution implementation was corrected, and regression tests were added to prevent the issue from recurring.

### SEO Verification Requirements

Before production deployment:

- Verify the correct production origin.
- Verify generated canonical URLs.
- Verify reciprocal language alternates.
- Verify x-default references.
- Verify sitemap content.
- Verify robots configuration.
- Verify structured data.
- Verify social image URLs.
- Verify metadata in actual production HTML.
- Verify that staging remains non-indexable.

Production metadata verification must use a production build with indexing explicitly enabled.

A staging E2E run is not a substitute for production SEO HTML verification.

## Accessibility

WCAG 2.2 AA is the engineering target.

Accessibility must be considered throughout development, not only during final testing.

Meeting this target requires verification against the final rendered website and does not follow automatically from the use of accessible component libraries or automated testing.

### Accessibility Requirements

- Semantic HTML.
- Logical heading hierarchy.
- Keyboard navigation.
- Visible focus indicators.
- Accessible names and descriptions.
- Meaningful image alternative text.
- Sufficient color contrast.
- Responsive text.
- Support for text zoom.
- Reduced motion support.
- Accessible interactive components.
- Appropriate screen reader behavior.
- Accessible navigation.
- Appropriate focus management.
- Meaningful landmark regions.
- Accessible touch targets.

Decorative content must not interfere with assistive technology.

Use automated accessibility checks alongside manual keyboard and screen reader testing.

### Accessibility Audit

The dedicated accessibility audit includes:

| Area                | Verification                                  |
| ------------------- | --------------------------------------------- |
| Skip navigation     | Direct access to the main content             |
| Navigation          | Current-page identification                   |
| Landmarks           | Semantic page structure                       |
| Headings            | Logical heading hierarchy                     |
| Keyboard            | Complete keyboard interaction                 |
| Focus               | Visible and predictable focus management      |
| Animations          | Reduced motion support                        |
| Screen readers      | Accessible names and announcements            |
| Contrast            | Foreground, controls and focus indicators     |
| Responsive behavior | Zoom, reflow and touch targets                |
| Automated testing   | axe-core and Playwright                       |
| Manual testing      | Browser and assistive technology verification |

The completion of the dedicated accessibility audit remains a release requirement.

## Media Architecture

Media assets use centralized URL resolution and reusable presentation components.

### Local Media

Local assets are stored under:

```text
public/assets/
```

The media URL resolver normalizes supported relative asset paths to the public assets directory when a CDN endpoint is not configured.

Supported local path examples:

```text
/images/example.webp
images/example.webp
/assets/images/example.webp
assets/images/example.webp
```

All of these resolve to:

```text
/assets/images/example.webp
```

### ImageKit Integration

The optional ImageKit endpoint is configured through:

```dotenv
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/tronosa
```

The resolver supports:

- Local asset fallback.
- Absolute CDN URLs.
- Width transformations.
- Quality transformations.
- Default transformation quality.
- Existing query parameter preservation.
- Transformation replacement.
- Endpoint whitespace normalization.
- Endpoint trailing slash normalization.

### CDN Source Validation

When a CDN endpoint is configured, image URL resolution restricts sources to the configured origin and project path.

Validation covers:

- Unexpected origins.
- Unexpected protocols and ports.
- Sources outside the configured project path.
- Path traversal outside the configured project path.
- Similar but unrelated CDN project paths.

When no CDN endpoint is configured, existing absolute HTTP and HTTPS URLs are preserved.

This behavior must be considered alongside the application's image configuration and Content Security Policy.

### Media Delivery Status

The media URL infrastructure is implemented and covered by automated tests.

Final image optimization, CDN configuration, actual production asset paths and video delivery must be verified after the final media material is available.

## Performance Engineering

Performance is a primary architectural requirement.

### Performance Strategy

- Static generation whenever applicable.
- Server Components by default.
- Minimal client-side JavaScript.
- Optimized image delivery.
- Lazy loading of appropriate resources.
- Dynamic component imports where beneficial.
- Route-specific resource isolation.
- Controlled animation initialization.
- Reduced layout shifts.
- Appropriate Web Worker usage.
- Minimal runtime dependencies.
- Centralized content retrieval.
- Avoidance of unnecessary network requests.

Performance optimizations must preserve accessibility and functional correctness.

### Third-Party Resource Isolation

Interactive website sections use specialized third-party libraries.

These libraries must not be unnecessarily transferred to routes that do not require their functionality.

The following runtime isolation improvements have been implemented:

- MapLibre runtime isolation.
- Swiper runtime isolation.
- GSAP runtime isolation.
- ScrollTrigger runtime isolation.

### MapLibre Optimization

MapLibre is used by the interactive distribution map.

The optimization introduces:

- A dynamic client-side map boundary.
- Map-specific stylesheet isolation.
- Deferred MapLibre runtime initialization.
- Viewport-based initialization.
- Dimension-aware initialization.
- Web Worker usage.
- Preservation of server-rendered location directory content.
- Runtime cleanup.

The map canvas and its runtime dependencies are separated from the initial content rendering architecture.

### Swiper Optimization

Swiper is used by interactive card slider sections.

The optimization introduces a dedicated slider runtime component using a dynamic import.

Server-side rendering remains enabled for the slider runtime.

Verified behavior:

- All four cards from the tested home-page slider are present in initial HTML.
- The first card remains visible when JavaScript is disabled.
- Slider functionality remains available when JavaScript is enabled.
- Identified Swiper resources are not transferred during the measured blog article initial load.

The preservation of server-rendered slider content does not imply full slider functionality without JavaScript.

### GSAP Optimization

GSAP is used by interactive product and editorial experiences.

The optimization separates animation dependencies from components that do not require immediate animation initialization.

ProductShowcase uses a dynamic animation boundary activated after user interaction.

The existing 450 ms product interaction throttle is retained to preserve controlled animation transitions.

ProductExperience dynamically loads the applicable desktop or mobile animation module.

The responsive animation architecture retains:

- Desktop scroll animations.
- Mobile product transitions.
- Swipe navigation.
- Responsive media query handling.
- Existing animation configuration.
- GSAP context cleanup.
- Protection against stale asynchronous animation initialization.

The existing animation behavior has been manually verified.

Detailed reduced-motion and layout stability verification remain part of the final accessibility and performance audits.

### Verified Resource Transfer Results

The following measurements were recorded on 21 November 2026.

Test environment:

```text
Local production-mode Next.js application
```

Tested route:

```text
/blog/prirodno-poreklo
```

Measurement method:

```text
Browser DevTools Network transfer measurements
```

| Metric                       | Original | Optimized |  Reduction |
| ---------------------------- | -------: | --------: | ---------: |
| JavaScript transfer          | 273.7 KB |    216 KB |      21.1% |
| CSS transfer                 |  36.4 KB |   24.4 KB |      33.0% |
| Combined JS and CSS transfer | 310.1 KB |  240.4 KB |      22.5% |
| JavaScript requests          |       13 |        11 | 2 requests |
| CSS requests                 |        6 |         5 |  1 request |

Total measured JS and CSS transfer reduction:

```text
69.7 KB
```

The identified MapLibre, Swiper and GSAP runtime chunks were not requested during the measured initial article load.

The runtime resources remain available in the production build for sections that require them.

### Performance Measurement Limitations

The recorded measurements represent a specific route under local production-mode conditions.

These results must not be interpreted as:

- A 22.5% improvement in total website loading speed.
- A guaranteed reduction on every website route.
- A production CDN performance benchmark.
- A measured Core Web Vitals improvement.
- A guaranteed search engine ranking improvement.

Final performance validation must use completed pages, final media assets and representative deployment conditions.

### Bundle Analysis

Run the application bundle analyzer:

```bash
pnpm analyze
```

Bundle analysis should be combined with actual browser Network measurements.

The presence of a dependency in the build output or module graph does not necessarily mean it is transferred during initial navigation.

## Code Quality

### Formatting

Check formatting:

```bash
pnpm format:check
```

Format supported files:

```bash
pnpm format
```

Format an individual file:

```bash
pnpm exec prettier --write README.md
```

### Linting

Run ESLint:

```bash
pnpm lint
```

Apply supported automatic fixes:

```bash
pnpm lint:fix
```

The linting configuration treats warnings as failures during the standard quality verification process.

### Type Checking

Run application type checking:

```bash
pnpm typecheck
```

Run TypeScript directly:

```bash
pnpm exec tsc --noEmit
```

### Reliability Type Checking

```bash
pnpm typecheck:reliability
```

### Dependency Verification

```bash
pnpm check:dependencies
```

### Git Verification

```bash
pnpm check:git
```

## Security

Security infrastructure is centralized in:

```text
src/lib/security/
```

### Security Controls

The application includes configured controls for:

- Content Security Policy.
- Resource origin restrictions.
- Web Worker permissions.
- Frame embedding restrictions.
- Object embedding restrictions.
- Form action restrictions.
- Base URL restrictions.
- HTTP response security headers.
- Canonical URL validation.
- CDN source validation.
- JSON content validation.
- Automated secret detection.
- Dependency security auditing.

Security configuration must be verified against actual deployed HTTP responses.

Unit test coverage does not guarantee the absence of security vulnerabilities or deployment misconfiguration.

### Dependency Security

Check production dependencies:

```bash
pnpm check:security:prod
```

Check all dependencies:

```bash
pnpm check:security
```

Execute the security verification pipeline:

```bash
pnpm verify:security
```

### Secret Detection

Scan repository history using Gitleaks:

```bash
pnpm check:secrets
```

Scan staged changes:

```bash
pnpm check:secrets:staged
```

Staged secret detection is mandatory during the pre-commit process.

## Testing

The testing strategy combines:

- Unit testing.
- Integration testing.
- End-to-end testing.
- Accessibility testing.
- Security testing.
- Performance testing.
- Reliability testing.

### Unit Tests

```bash
pnpm test:unit
```

### Integration Tests

```bash
pnpm test:integration
```

### Complete Vitest Suite

```bash
pnpm test
```

Run Vitest directly:

```bash
pnpm exec vitest run
```

### Watch Mode

```bash
pnpm test:watch
```

### Run a Specific Test

```bash
pnpm exec vitest run -t "test name"
```

Run a specific test file:

```bash
pnpm exec vitest run tests/unit/content/registry.test.ts
```

### Test Coverage

```bash
pnpm test:coverage
```

Run coverage directly:

```bash
pnpm exec vitest run --coverage
```

### Coverage Thresholds

The project enforces global minimum coverage thresholds.

| Metric     | Required Minimum |
| ---------- | ---------------: |
| Statements |              96% |
| Branches   |              90% |
| Functions  |              97% |
| Lines      |              96% |

Coverage thresholds must not be reduced merely to allow incomplete implementations to pass.

Production code must not be excluded from meaningful coverage simply to improve reported percentages.

### Testing Guidelines

- Test observable behavior.
- Test schema validation.
- Test semantic output.
- Test business rules.
- Test edge cases.
- Test failure scenarios.
- Test deterministic behavior.
- Test environment-specific behavior.
- Add regression tests for resolved defects.
- Avoid testing implementation details unnecessarily.
- Maintain meaningful coverage.
- Preserve test isolation.

### Content Registry Testing

Content Registry tests cover:

- Filesystem discovery.
- Missing collections.
- Invalid JSON.
- Invalid content schemas.
- Duplicate content identities.
- Duplicate public URLs.
- Section boundaries.
- Singleton sections.
- Content references.
- Locale filtering.
- Content retrieval.
- Published article filtering.
- Draft exclusion.
- Publication ordering.
- Featured article selection.
- Related article selection.

The registry testing infrastructure uses mocked filesystem operations for controlled test scenarios.

### Article Validation Testing

Article tests cover:

- Supported publication statuses.
- Content identifiers.
- Article slugs.
- Article categories.
- Featured article configuration.
- Chronological date validation.
- Timezone-aware timestamp comparisons.
- Author types.
- Author identification.
- Article previews.
- Image dimensions.
- Article image layout.
- Alternative text.
- Image priority.

### End-to-End Tests

Install Playwright browsers:

```bash
pnpm exec playwright install
```

Generate the test build:

```bash
pnpm build:test
```

Run end-to-end tests:

```bash
pnpm test:e2e
```

Run browser tests in headed mode:

```bash
pnpm test:e2e:headed
```

Open Playwright UI:

```bash
pnpm test:e2e:ui
```

Open an available Playwright report:

```bash
pnpm test:e2e:report
```

The configured Playwright server runs on port 3100 with server reuse disabled.

The current Playwright configuration remains the source of truth.

### E2E Environment Policy

Playwright runs against a production-mode build using staging environment rules.

The staging SEO suite verifies:

- Localized public routes.
- Default locale normalization.
- Canonical URL preservation.
- Unknown content handling.
- JSON-LD presence.
- Absence of language alternates.
- Noindex directives.
- Nofollow directives.

Production indexing behavior is covered by SEO unit and integration tests and requires separate production HTML verification.

### Accessibility Tests

```bash
pnpm test:a11y
```

### Security Tests

```bash
pnpm test:security
```

### Content Security Policy Tests

```bash
pnpm test:csp
```

### Browser Reliability Tests

```bash
pnpm test:reliability
```

### Regression Testing

```bash
pnpm test:regression
```

Ensure that the appropriate test build exists before running browser-based regression tests.

## Verification Pipeline

### Standard Verification

```bash
pnpm verify
```

### Full Verification

```bash
pnpm verify:full
```

The verification pipeline:

```text
verify:full
│
├── verify
│   ├── format:check
│   ├── lint
│   ├── typecheck
│   ├── typecheck:reliability
│   ├── test:coverage
│   └── build:test
│
├── test:e2e
├── check:dependencies
└── check:git
```

The current package.json and Git hooks remain authoritative if verification scripts change.

### Pre-commit Quality Gates

The Husky pre-commit hook executes:

```text
pre-commit
│
├── check:secrets:staged
└── verify:full
```

A commit is blocked when any mandatory quality gate fails.

Mandatory verification includes:

- Staged secret detection.
- Formatting verification.
- ESLint verification.
- Application type checking.
- Reliability test type checking.
- Automated test coverage.
- Production-mode test build.
- End-to-end browser tests.
- Dependency verification.
- Git verification.

Do not bypass failing pre-commit quality gates.

Dependency security audits, Lighthouse runs and standalone k6 load scenarios are separate from the mandatory pre-commit sequence.

## Quality Baselines

Historical engineering results must be preserved rather than silently replaced.

### Automated Test Progress

| Metric               | Pre-blog Baseline | Initial Blog Baseline | Latest Verified Baseline |
| -------------------- | ----------------: | --------------------: | -----------------------: |
| Passing Vitest tests |               278 |                   371 |                      610 |
| Test files           |                16 |                    20 |                       22 |
| Statement coverage   |            96.81% |                93.68% |                   99.73% |
| Branch coverage      |            91.32% |                89.20% |                   99.54% |
| Function coverage    |      Not recorded |                86.66% |                     100% |
| Line coverage        |      Not recorded |                94.11% |                   99.72% |

### Latest Verified Coverage

Recorded on 21 November 2026.

| Metric     | Required Minimum | Verified Result | Status |
| ---------- | ---------------: | --------------: | ------ |
| Statements |              96% |          99.73% | PASS   |
| Branches   |              90% |          99.54% | PASS   |
| Functions  |              97% |            100% | PASS   |
| Lines      |              96% |          99.72% | PASS   |

Automated test execution:

```text
Test Files: 22 passed (22)
Tests:      610 passed (610)
Duration:   3.49s
```

The recorded duration includes V8 coverage collection.

### Coverage Improvement

The initial expanded blog coverage did not satisfy the established global thresholds.

Additional tests were introduced for:

- Article schema validation.
- Article image schema validation.
- Content Registry business rules.
- Published and draft content behavior.
- Featured article selection.
- Related article selection.
- Media URL resolution.
- Canonical URL resolution.
- Language alternate generation.

All four global coverage thresholds were subsequently satisfied without reducing the required minimums.

### Latest Coverage by Architectural Area

| Area                      | Statements | Branches | Functions |  Lines |
| ------------------------- | ---------: | -------: | --------: | -----: |
| SEO infrastructure        |       100% |     100% |      100% |   100% |
| Structured data           |       100% |     100% |      100% |   100% |
| Security infrastructure   |       100% |     100% |      100% |   100% |
| Content schemas           |       100% |     100% |      100% |   100% |
| Section schemas           |       100% |     100% |      100% |   100% |
| Media URL resolver        |       100% |     100% |      100% |   100% |
| Internationalization      |       100% |     100% |      100% |   100% |
| Environment configuration |       100% |     100% |      100% |   100% |
| Content Registry          |     98.59% |   98.07% |      100% | 98.52% |

Coverage percentages represent modules included in the configured V8 coverage scope.

They must not be interpreted as complete coverage of the entire React application, every visual component or every possible user interaction.

### End-to-End Verification Baseline

The last explicitly recorded full browser test run produced:

```text
148 passed
1 failed
149 total
```

The failing SEO assertion expected production hreflang metadata while running against a staging-policy build.

The E2E SEO suite was subsequently updated to verify the intended staging behavior.

The updated suite is expected to contain 150 tests.

The successful execution result must be recorded separately after verification. Starting or completing a code modification alone is not evidence that the updated suite passes.

### Test Isolation

Test isolation remains enabled.

Worker reuse must not be introduced solely to reduce an already acceptable test execution duration without evaluating its impact on mocks, environment variables and test independence.

## Performance Testing

Performance testing uses Lighthouse CI and browser-based inspection.

### Complete Lighthouse CI Workflow

```bash
pnpm test:performance
```

### Collect Performance Results

```bash
pnpm test:performance:collect
```

### Assert Performance Requirements

```bash
pnpm test:performance:assert
```

### Upload Performance Reports

```bash
pnpm test:performance:report
```

Performance measurements must be associated with:

- Application version.
- Git commit.
- Build configuration.
- Tested route.
- Browser configuration.
- Device configuration.
- Network configuration.
- Media configuration.
- Test date.

### Core Web Vitals

The final performance audit will evaluate:

| Metric | Description               | Good Threshold           |
| ------ | ------------------------- | ------------------------ |
| LCP    | Largest Contentful Paint  | 2.5 seconds or less      |
| INP    | Interaction to Next Paint | 200 milliseconds or less |
| CLS    | Cumulative Layout Shift   | 0.1 or less              |

Field Core Web Vitals assessment uses the 75th percentile of relevant page visits.

Laboratory measurements and real-user field measurements must be distinguished.

Final Core Web Vitals results have not yet been established.

## Reliability Engineering

Reliability testing evaluates the behavior of production-mode application instances under controlled traffic conditions.

### Reliability Infrastructure

| Technology     | Responsibility                     |
| -------------- | ---------------------------------- |
| Docker         | Isolated runtime environments      |
| Docker Compose | Service orchestration              |
| Next.js        | Production application runtime     |
| Nginx          | Reverse proxy and load balancing   |
| Grafana k6     | Traffic generation and measurement |

### Reliability Testing Objectives

- Validate application stability.
- Measure request throughput.
- Identify performance bottlenecks.
- Evaluate HTTP failure rates.
- Evaluate dropped iterations.
- Measure response latency.
- Observe CPU and memory consumption.
- Evaluate behavior under sustained traffic.
- Identify saturation points.
- Evaluate recovery after increased traffic.
- Compare equivalent application configurations.

### Reliability Scenarios

| Scenario       | Purpose                                            |
| -------------- | -------------------------------------------------- |
| Smoke          | Validate basic production availability             |
| Light Load     | Evaluate regular concurrent traffic                |
| Constant Load  | Evaluate sustained request throughput              |
| Heavy Load     | Evaluate higher sustained traffic                  |
| Stress         | Identify application limitations                   |
| Spike          | Evaluate sudden traffic increases                  |
| Capacity       | Evaluate application throughput boundaries         |
| Business Spike | Evaluate representative business traffic increases |
| Soak           | Evaluate extended runtime stability                |
| Recovery       | Evaluate behavior after elevated traffic           |

### Preparing the Reliability Environment

Inspect available scripts:

```bash
pnpm run
```

Inspect running Docker Compose projects:

```bash
docker compose ls
```

From the applicable reliability Compose directory:

```bash
docker compose config --services
docker compose config --quiet
```

Use the existing repository scenario definitions and Compose configuration.

Reliability testing is executed independently of the standard verification and pre-commit pipeline.

### Reliability Commands

```bash
pnpm test:reliability:smoke
pnpm test:reliability:light-load
pnpm test:reliability:load
pnpm test:reliability:heavy-load
pnpm test:reliability:stress
pnpm test:reliability:spike
pnpm test:reliability:capacity
pnpm test:reliability:business-spike
pnpm test:reliability:soak
pnpm test:reliability:recovery
```

Inspect the scenario configuration and target URL before executing a reliability test.

Do not load-test public production infrastructure without authorization.

### Reliability Metrics

| Metric             | Description                          |
| ------------------ | ------------------------------------ |
| http_reqs          | Total HTTP requests                  |
| http_req_duration  | HTTP request duration                |
| http_req_failed    | HTTP request failure rate            |
| dropped_iterations | Iterations that could not be started |
| p50                | Median response duration             |
| p95                | 95th percentile response duration    |
| p99                | 99th percentile response duration    |
| VUs                | Virtual users                        |
| RPS                | Requests per second                  |
| CPU                | Processor utilization                |
| Memory             | Runtime memory consumption           |

### Historical Reliability Results

| Scenario                    |    Requests / Checks | Result |
| --------------------------- | -------------------: | ------ |
| Production Smoke            |                42/42 | PASSED |
| Light Load — 50 VUs         |                5,868 | PASSED |
| Constant Load — 100 req/s   |               30,001 | PASSED |
| Heavy Load — 500 req/s      |              300,001 | PASSED |
| Stress — target 2,000 req/s | Target not sustained | FAILED |

The successful load scenarios recorded:

- Zero HTTP request failures.
- Zero dropped iterations.

The heavy load scenario sustained its configured target of 500 requests per second over a ten-minute period.

The stress scenario did not satisfy its acceptance criteria.

These results are historical measurements from the tested local reliability environment and must not be represented as measurements of the latest completed website.

### Reliability Limitations

Historical reliability results must not be interpreted as:

- Guaranteed production capacity.
- Guaranteed Netlify capacity.
- Guaranteed concurrent visitor capacity.
- Guaranteed CDN throughput.
- A production service-level agreement.

Production behavior depends on infrastructure, caching, geographic distribution, network conditions, deployment configuration and traffic characteristics.

HTTP request throughput and concurrent website visitors are different measurements and must not be treated as equivalent.

### Reliability Evidence

Each reliability execution should document:

- Application version.
- Git commit.
- Execution date.
- Test environment.
- Hardware configuration.
- Runtime configuration.
- Number of application instances.
- Compression configuration.
- Generated page count.
- Scenario configuration.
- Scenario duration.
- Acceptance criteria.
- Request throughput.
- Total HTTP requests.
- HTTP failures.
- Dropped iterations.
- Response latency percentiles.
- CPU utilization.
- Memory utilization.
- Final result.
- Observed limitations.

## Final Performance Validation

Final performance and reliability validation will be performed after implementing all production pages, editorial content and required media.

### Page Count Comparison

The final validation will compare application builds with different generated page counts.

| Scenario | Generated Content Pages |
| -------- | ----------------------: |
| Baseline |                      12 |
| Extended |                      21 |

These are planned comparison scenarios.

The actual number of generated localized pages and articles must be recorded during final testing.

Both scenarios must use equivalent testing conditions.

### Comparison Metrics

- Build duration.
- Generated output size.
- Application startup time.
- Initial JavaScript transfer.
- Initial CSS transfer.
- Runtime memory consumption.
- Request throughput.
- Response latency.
- HTTP failure rate.
- Dropped iterations.
- CPU utilization.
- Application stability.
- Lighthouse performance measurements.
- Layout stability.

Framework-generated routes should be recorded separately from localized content pages and editorial articles.

## Command Reference

### Development and Build

| Command           | Purpose                              |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Start the development server         |
| `pnpm build`      | Generate a production build          |
| `pnpm start`      | Start the production runtime         |
| `pnpm build:test` | Generate a staging-policy test build |
| `pnpm start:test` | Start the test runtime               |
| `pnpm analyze`    | Analyze application bundles          |

### Code Quality

| Command                      | Purpose                                   |
| ---------------------------- | ----------------------------------------- |
| `pnpm lint`                  | Execute ESLint                            |
| `pnpm lint:fix`              | Apply supported lint fixes                |
| `pnpm typecheck`             | Generate route types and check TypeScript |
| `pnpm typecheck:reliability` | Check reliability test TypeScript         |
| `pnpm format`                | Format supported files                    |
| `pnpm format:check`          | Verify formatting                         |
| `pnpm check:dependencies`    | Verify peer dependencies                  |
| `pnpm check:git`             | Verify Git whitespace consistency         |

### Automated Testing

| Command                 | Purpose                                       |
| ----------------------- | --------------------------------------------- |
| `pnpm test`             | Execute Vitest                                |
| `pnpm test:watch`       | Execute Vitest in watch mode                  |
| `pnpm test:coverage`    | Execute coverage verification                 |
| `pnpm test:unit`        | Execute unit tests                            |
| `pnpm test:integration` | Execute integration tests                     |
| `pnpm test:e2e`         | Execute browser tests                         |
| `pnpm test:e2e:ui`      | Open Playwright UI                            |
| `pnpm test:e2e:headed`  | Execute visible browser tests                 |
| `pnpm test:e2e:report`  | Open available browser reports                |
| `pnpm test:a11y`        | Execute tagged accessibility tests            |
| `pnpm test:regression`  | Execute coverage and browser regression tests |
| `pnpm test:security`    | Execute tagged security tests                 |
| `pnpm test:csp`         | Execute tagged CSP tests                      |
| `pnpm test:reliability` | Execute tagged browser reliability tests      |

### Performance Testing

| Command                         | Purpose                        |
| ------------------------------- | ------------------------------ |
| `pnpm test:performance`         | Execute Lighthouse CI          |
| `pnpm test:performance:collect` | Collect Lighthouse results     |
| `pnpm test:performance:assert`  | Assert Lighthouse requirements |
| `pnpm test:performance:report`  | Upload Lighthouse reports      |

### Security and Verification

| Command                     | Purpose                                  |
| --------------------------- | ---------------------------------------- |
| `pnpm check:security`       | Audit dependencies                       |
| `pnpm check:security:prod`  | Audit production dependencies            |
| `pnpm check:secrets`        | Scan repository history for secrets      |
| `pnpm check:secrets:staged` | Scan staged changes for secrets          |
| `pnpm verify`               | Execute standard verification            |
| `pnpm verify:full`          | Execute full verification                |
| `pnpm verify:security`      | Execute dependency security verification |
| `pnpm prepare`              | Initialize Husky hooks                   |

### Standalone Reliability Testing

| Command                                | Purpose                        |
| -------------------------------------- | ------------------------------ |
| `pnpm test:reliability:smoke`          | Smoke testing                  |
| `pnpm test:reliability:light-load`     | Light traffic testing          |
| `pnpm test:reliability:load`           | Sustained traffic testing      |
| `pnpm test:reliability:heavy-load`     | Heavy traffic testing          |
| `pnpm test:reliability:stress`         | Stress testing                 |
| `pnpm test:reliability:spike`          | Traffic spike testing          |
| `pnpm test:reliability:capacity`       | Capacity testing               |
| `pnpm test:reliability:business-spike` | Business traffic spike testing |
| `pnpm test:reliability:soak`           | Extended stability testing     |
| `pnpm test:reliability:recovery`       | Recovery testing               |

## Git Workflow

### Branches

| Branch     | Responsibility                       |
| ---------- | ------------------------------------ |
| main       | Production-ready code                |
| develop    | Development integration              |
| feat/*     | Feature development                  |
| fix/*      | Defect resolution                    |
| test/*     | Testing and reliability improvements |
| docs/*     | Documentation improvements           |
| refactor/* | Internal architecture improvements   |
| perf/*     | Performance improvements             |

### Starting a Feature

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feat/example-feature
```

### Before Committing

```bash
pnpm verify:full

git status
git diff --check
git diff --cached --check
```

### Commit Convention

The project follows Conventional Commit naming.

```text
feat(blog): implement multilingual editorial system

feat(content): introduce related article recommendations

fix(seo): correct absolute canonical URL resolution

test(content): expand article registry coverage

refactor(content): simplify section rendering architecture

perf(map): isolate MapLibre runtime dependencies

perf(animation): defer GSAP runtime initialization

docs(readme): update project documentation
```

Commits should describe the actual changes and relevant verified results.

Do not claim that tests or performance checks passed unless their execution was observed.

### Pull Requests

Pull requests should include:

- A clear description.
- Implementation details.
- Relevant architectural decisions.
- Testing evidence.
- Performance implications.
- Accessibility implications.
- Security implications.
- Known limitations.
- Related documentation changes.

### After Merging

```bash
git switch develop
git pull --ff-only origin develop
git fetch --prune
git branch --merged develop
```

Delete local feature branches only after confirming their changes have been merged or safely preserved.

## Deployment

The intended hosting platform is Netlify.

### Deployment Principles

- Install locked dependencies.
- Execute the configured production build.
- Use the existing deployment configuration.
- Separate staging and production environments.
- Preserve environment-specific configuration.
- Verify generated routes.
- Verify metadata and canonical URLs.
- Verify static asset availability.
- Verify deployed security headers.
- Preserve existing domain and email DNS records.
- Enable production indexing only when ready.

Do not assume a pure output export configuration without checking the current Next.js and Netlify configuration.

Statically generated routes can coexist with a Next.js server runtime.

### Deployment Verification

Verify:

- Public website availability.
- Localized navigation.
- Localized public routes.
- Published article routes.
- Draft article exclusion.
- Canonical URLs.
- Language alternates.
- Sitemap.
- Robots configuration.
- Structured data.
- Social metadata.
- Image and video delivery.
- Security headers.
- Interactive component functionality.

## License

Proprietary software.

All rights reserved.

Unauthorized reproduction, distribution or use is prohibited, subject to the applicable project agreement.

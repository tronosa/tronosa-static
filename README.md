# Tronoša — Website

Multilingual corporate and editorial website built with Next.js, with a focus on performance, accessibility, search engine optimization, maintainability, and operational reliability.

The website uses version-controlled JSON content and statically generated pages. Content changes are published through the normal Git and deployment workflow without a CMS or database.

## Technology Stack

| Technology                     | Purpose                                          |
| ------------------------------ | ------------------------------------------------ |
| Next.js 16.4.6                 | Application framework and static page generation |
| React                          | Server and client components                     |
| TypeScript                     | Static type safety                               |
| Tailwind CSS                   | Styling and design tokens                        |
| Class Variance Authority (CVA) | Component styles and variants                    |
| Zod                            | Content validation                               |
| next-intl                      | Internationalization                             |
| GSAP                           | Animation and interactive experiences            |
| MapLibre GL JS                 | Interactive distribution map                     |
| Vitest                         | Unit and integration testing                     |
| Playwright                     | End-to-end browser testing                       |
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
- Centralized content validation.
- Reusable and maintainable components.
- Consistent design system.
- Automated quality verification.
- Evidence-driven performance engineering.
- No unnecessary runtime dependencies.

## Getting Started

### Prerequisites

- Node.js (version specified by the repository or CI configuration).
- pnpm 12.6.0.
- Git.
- Docker Desktop with Docker Compose for reliability testing.

Verify installed tools:

```bash
node --version
pnpm --version
git --version
docker --version
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

## Environment Configuration

Configure local environment variables inside `.env.local` when required.

Example:

```dotenv
APP_ENV=staging
SITE_URL=https://example.com
```

### Environment Guidelines

- Never commit secrets or machine-specific configuration.
- Keep staging and production environments separate.
- Use the actual production origin for canonical URLs.
- Allow Next.js to configure NODE_ENV automatically.
- Follow the existing environment validation schema.

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

Always verify production behavior before opening a pull request.

Development-server behavior is not a substitute for production verification.

## Project Architecture

The following structure represents the primary architectural areas of the application.

```text
src/
├── app/
├── components/
│   ├── ui/
│   └── sections/
├── content/
│   ├── pages/
│   ├── blog/
│   └── schemas/
├── i18n/
└── lib/
    ├── animation/
    ├── content/
    └── seo/

public/
tests/
```

### Architectural Responsibilities

| Directory           | Responsibility                         |
| ------------------- | -------------------------------------- |
| app                 | Application routing and layouts        |
| components/ui       | Reusable design-system components      |
| components/sections | JSON-driven page sections              |
| content/pages       | Localized page content                 |
| content/blog        | Localized article content              |
| content/schemas     | Content validation schemas             |
| i18n                | Internationalization configuration     |
| lib/content         | Content registry and content retrieval |
| lib/seo             | Metadata and structured data           |
| lib/animation       | Shared animation infrastructure        |
| public              | Public static assets                   |
| tests               | Automated testing infrastructure       |

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
- Avoid unnecessary abstraction and duplicated functionality.

## Internationalization

The application supports three locales.

| Locale  | Language         |
| ------- | ---------------- |
| sr-Latn | Serbian Latin    |
| sr-Cyrl | Serbian Cyrillic |
| en      | English          |

### Localization Requirements

- Localized page content.
- Localized article content.
- Localized navigation.
- Localized metadata.
- Localized accessibility labels.
- Locale-specific URLs.
- Language alternate links.
- Stable content identifiers across translations.

Article translations should share the same content ID while allowing different localized slugs.

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

Available content methods include:

| Method                | Responsibility                              |
| --------------------- | ------------------------------------------- |
| getContentRegistry()  | Retrieve validated content                  |
| getContentBySlug()    | Retrieve content by kind, locale and slug   |
| getPublishedContent() | Retrieve content for site-wide integrations |
| getPublishedPosts()   | Retrieve localized blog posts               |
| getFeaturedPost()     | Retrieve the featured article               |
| getRelatedPosts()     | Retrieve related articles                   |

Filesystem operations must remain centralized within the Content Registry.

Individual components must not directly access the filesystem.

## Blog and Editorial System

The blog is designed as a modular editorial experience rather than a traditional card-based blog.

Articles are stored as localized JSON files.

Adding new article content does not require creating a new React page or manually registering an article.

Content becomes available through the normal deployment workflow.

### Article Fields

| Field               | Description                        |
| ------------------- | ---------------------------------- |
| id                  | Stable content identifier          |
| slug                | Localized URL segment              |
| status              | Publication status                 |
| createdAt           | Content creation timestamp         |
| modifiedAt          | Last modification timestamp        |
| publishedAt         | Publication timestamp              |
| category            | Article category                   |
| featured            | Featured article eligibility       |
| author              | Article author                     |
| author.name         | Required author name               |
| author.url          | Optional author identification URL |
| preview.title       | Article preview title              |
| preview.description | Article preview description        |
| preview.image       | Optional article preview image     |
| seo                 | Search engine metadata             |
| content.sections    | Ordered article sections           |

The current article schema includes a status field.

Use the published status for production content. If draft support is retained, draft articles must not appear in public routes, listings or the sitemap.

### Article Categories

| Identifier     | Purpose                          |
| -------------- | -------------------------------- |
| nature         | Nature and natural origin        |
| hydration      | Hydration and water consumption  |
| health         | Health-related editorial content |
| sustainability | Environmental responsibility     |
| company        | Company-related stories          |
| news           | Announcements and news           |

### Article Author

The article author is required.

Minimal configuration:

```json
{
  "author": {
    "name": "Tronoša"
  }
}
```

Optional author URL:

```json
{
  "author": {
    "name": "Tronoša",
    "url": "https://tronosa.com/"
  }
}
```

The optional URL provides additional author identification through structured data.

### Article Dates

Dates must use valid ISO 8601 timestamps.

```json
{
  "createdAt": "2026-11-20T10:00:00+01:00",
  "modifiedAt": "2026-11-20T11:00:00+01:00",
  "publishedAt": "2026-11-20T12:00:00+01:00"
}
```

- createdAt represents content creation.
- modifiedAt represents the most recent modification.
- publishedAt represents public publication.

Article listings are ordered by publication date.

## Editorial Components

The following components represent the planned editorial system. Components must be registered and verified before being used in production content.

| Component        | Responsibility                    |
| ---------------- | --------------------------------- |
| BlogHero         | Blog landing page introduction    |
| FeaturedBlogPost | Featured editorial article        |
| BlogPosts        | Published article collection      |
| ArticleHero      | Individual article introduction   |
| ContentSection   | Structured textual content        |
| ArticleImage     | Editorial image and caption       |
| ArticleQuote     | Highlighted quotation             |
| ArticleHighlight | Highlighted editorial information |
| RelatedPosts     | Related article recommendations   |
| RichText         | Structured rich text rendering    |
| RichTextInline   | Inline text formatting            |

### Editorial Layout

Article content should prioritize readability.

Recommended content widths:

| Width  | Maximum Width   | Purpose                        |
| ------ | --------------- | ------------------------------ |
| Narrow | 42rem           | Paragraphs and textual content |
| Medium | 56rem           | Extended editorial content     |
| Wide   | 64rem           | Images and visual sections     |
| Full   | Available width | Hero and full-width sections   |

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

- Do not use dangerouslySetInnerHTML.
- Preserve semantic HTML.
- Preserve whitespace between text fragments.
- Reuse existing typography styles.
- Avoid unnecessary DOM elements.
- Maintain accessible color contrast.
- Avoid introducing client-side hydration.

## ArticleHero

ArticleHero is a server-rendered editorial section with configurable appearance, decorative concentric rings and localized background text.

The appearance configuration follows the same CSS custom property approach used by ProductShowcase.

### Appearance Properties

| Property        | Responsibility                     |
| --------------- | ---------------------------------- |
| backgroundColor | Hero background color              |
| accentColor     | Decorative concentric ring color   |
| backgroundText  | Localized decorative wordmark      |
| title           | Optional formatted article heading |

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

### SEO Features

- Server-rendered HTML.
- Static page generation.
- Individual page metadata.
- Individual article metadata.
- Canonical URLs.
- Localized hreflang attributes.
- XML sitemap.
- Robots configuration.
- Open Graph metadata.
- Social sharing metadata.
- Structured data.
- Semantic HTML.
- Localized URL structure.
- Publication and modification timestamps.

### Structured Data

Structured data is generated according to the content type and applicable schema.

Article structured data must include accurate publication and author information.

### SEO Requirements

- Use the correct production origin.
- Avoid duplicate content.
- Maintain consistent canonical URLs.
- Validate language alternates.
- Keep sitemap entries synchronized with public content.
- Verify structured data before production deployment.
- Prevent staging deployments from becoming competing indexed versions of production.

## Accessibility

WCAG 2.2 AA is the engineering target.

Accessibility must be considered throughout development, not only during final testing.

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

Decorative content must not interfere with assistive technology.

Use automated accessibility checks alongside manual keyboard and screen reader testing.

## Performance Engineering

Performance is a primary architectural requirement.

### Performance Strategy

- Static generation whenever applicable.
- Server Components by default.
- Minimal client-side JavaScript.
- Optimized image delivery.
- Lazy loading of appropriate resources.
- Dynamic component imports where beneficial.
- Controlled animation initialization.
- Reduced layout shifts.
- Appropriate Web Worker usage.
- Minimal runtime dependencies.
- Centralized content retrieval.
- Avoidance of unnecessary network requests.

Performance optimizations must preserve accessibility and functional correctness.

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

### Linting

```bash
pnpm lint
```

### Type Checking

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

## Testing

The testing strategy combines unit, integration, end-to-end and reliability testing.

### Unit and Integration Tests

Run unit tests:

```bash
pnpm test:unit
```

Run coverage:

```bash
pnpm test:coverage
```

Run Vitest directly:

```bash
pnpm exec vitest run
```

Run a specific test:

```bash
pnpm exec vitest run -t "test name"
```

### Testing Guidelines

- Test observable behavior.
- Test schema validation.
- Test semantic output.
- Test edge cases.
- Test failure scenarios.
- Add regression tests for resolved defects.
- Avoid testing implementation details unnecessarily.
- Maintain meaningful coverage.

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

The previously configured Playwright production server runs on port 3100 with server reuse disabled.

The current Playwright configuration remains the source of truth.

## Verification Pipeline

### Standard Verification

```bash
pnpm verify
```

### Full Verification

```bash
pnpm verify:full
```

The previously observed verification pipeline:

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

## Historical Quality Baseline

The following results represent an observed pre-blog development baseline.

| Metric             | Result |
| ------------------ | ------ |
| Passing tests      | 278    |
| Test files         | 16     |
| Statement coverage | 96.81% |
| Branch coverage    | 91.32% |

These results must be updated after completing and verifying additional functionality.

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

### Reliability Scenarios

| Scenario      | Purpose                                |
| ------------- | -------------------------------------- |
| Smoke         | Validate basic production availability |
| Light Load    | Evaluate regular concurrent traffic    |
| Constant Load | Evaluate sustained request throughput  |
| Heavy Load    | Evaluate higher sustained traffic      |
| Stress        | Identify application limitations       |

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

The heavy load scenario sustained 500 requests per second over a ten-minute period.

The stress scenario did not satisfy its acceptance criteria.

### Reliability Limitations

Historical reliability results represent the tested local environment.

They must not be interpreted as:

- Guaranteed production capacity.
- Guaranteed Netlify capacity.
- Guaranteed concurrent visitor capacity.
- A production service-level agreement.

Production behavior depends on infrastructure, caching, geographic distribution, network conditions and deployment configuration.

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
- Scenario configuration.
- Scenario duration.
- Acceptance criteria.
- Request throughput.
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

Both scenarios must use equivalent testing conditions.

### Comparison Metrics

- Build duration.
- Generated output size.
- Application startup time.
- Runtime memory consumption.
- Request throughput.
- Response latency.
- HTTP failure rate.
- Dropped iterations.
- CPU utilization.
- Application stability.

Framework-generated routes should be recorded separately from localized content pages.

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
```

### Commit Convention

The project follows Conventional Commit naming.

```text
feat(blog): implement article hero section

fix(seo): correct localized article metadata

test(content): add article validation coverage

refactor(content): simplify content retrieval

perf(map): optimize worker initialization

docs(readme): update project documentation
```

### Pull Requests

Pull requests should include:

- A clear description.
- Implementation details.
- Relevant architectural decisions.
- Testing evidence.
- Performance implications.
- Accessibility implications.
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
- Preserve existing domain and email DNS records.

Do not assume a pure output export configuration without checking the current Next.js and Netlify configuration.

Statically generated routes can coexist with a Next.js server runtime.

## Production Release Checklist

### Code Quality

- [ ] Formatting passes.
- [ ] ESLint passes.
- [ ] TypeScript passes.
- [ ] Dependency verification passes.
- [ ] Git verification passes.

### Testing

- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] End-to-end tests pass.
- [ ] Production build succeeds.
- [ ] Content validation passes.

### Accessibility

- [ ] Keyboard navigation verified.
- [ ] Screen reader behavior verified.
- [ ] Color contrast verified.
- [ ] Heading hierarchy verified.
- [ ] Reduced motion verified.
- [ ] Responsive behavior verified.
- [ ] Text zoom verified.

### SEO

- [ ] Metadata verified.
- [ ] Canonical URLs verified.
- [ ] Language alternate links verified.
- [ ] Sitemap verified.
- [ ] Robots configuration verified.
- [ ] Structured data verified.

### Performance and Reliability

- [ ] Production performance verified.
- [ ] Image delivery verified.
- [ ] Runtime stability verified.
- [ ] Reliability scenarios executed where applicable.
- [ ] Performance evidence documented.
- [ ] Known limitations documented.

### Deployment

- [ ] Production environment verified.
- [ ] Domain configuration verified.
- [ ] Localized routes verified.
- [ ] Production deployment verified.

## Documentation and Evidence

Technical documentation must evolve alongside the application.

Documentation should include:

- Architecture decisions.
- Implementation details.
- Content configuration.
- Component configuration.
- Testing results.
- Performance evidence.
- Reliability evidence.
- Known limitations.
- Deployment instructions.
- Operational requirements.

Historical engineering evidence must be preserved rather than silently replaced.

Client-facing documentation should be updated when new functionality is completed and verified.

## Project Status

The website is under active development.

New functionality must follow the existing application architecture, design system, validation pipeline and engineering standards.

Planned functionality must not be represented as implemented until development and verification are complete.

## License

Proprietary software.

All rights reserved.

Unauthorized reproduction, distribution or use is prohibited, subject to the applicable project agreement.

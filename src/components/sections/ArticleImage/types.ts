import type { z } from "zod";

import type { articleImageContentSchema } from "./article-image.schema";

export type ArticleImageProps = z.infer<typeof articleImageContentSchema>;

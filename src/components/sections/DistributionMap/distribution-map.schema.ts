import { z } from "@/lib/validation/zod";

export const distributionLocationTypeSchema = z.enum([
  "retailer",
  "distributor",
  "production",
  "partner",
]);

export const distributionLocationAddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().min(1),
  postalCode: z.string().optional(),
  country: z.string().min(1),
});

export const distributionLocationCoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const distributionLocationImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
});

export const distributionLocationContactSchema = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
});

export const distributionLocationSchema = z.object({
  id: z.string().min(1),

  type: distributionLocationTypeSchema,

  title: z.string().min(1),
  description: z.string().optional(),

  address: distributionLocationAddressSchema,
  coordinates: distributionLocationCoordinatesSchema,

  image: distributionLocationImageSchema.optional(),
  contact: distributionLocationContactSchema.optional(),

  featured: z.boolean().default(false),
  enabled: z.boolean().default(true),
});

export const distributionLocationsSchema = z
  .array(distributionLocationSchema)
  .refine(
    (locations) =>
      new Set(locations.map((location) => location.id)).size ===
      locations.length,
    {
      message: "Distribution location IDs must be unique.",
    },
  );

export const distributionMapInitialViewSchema = z.object({
  latitude: z.number().min(-90).max(90).default(44.05),
  longitude: z.number().min(-180).max(180).default(20.45),
  zoom: z.number().min(0).max(22).default(6),
});

export const distributionMapContentSchema = z.object({
  eyebrow: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),

  initialView: distributionMapInitialViewSchema.optional(),

  categories: z.array(distributionLocationTypeSchema).optional(),

  showLegend: z.boolean().default(true),
  showLocationList: z.boolean().default(true),
});

export const distributionMapSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("distribution-map"),
  content: distributionMapContentSchema,
});

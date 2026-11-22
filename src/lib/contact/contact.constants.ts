export const CONTACT_LIMITS = {
  name: {
    min: 2,
    max: 100,
  },
  email: {
    max: 254,
  },
  subject: {
    min: 3,
    max: 150,
  },
  message: {
    min: 10,
    max: 3000,
  },
} as const;

import z from 'zod';

const imageSchema = z.object({
    url: z.string().url(),
    public_id: z.string(),
  });

  const reviewsSchema = z.object({
    link: z.string().url(),
    score: z.number().min(0).max(10),
    reviewText: z.string(),
  });

  const awardsSchema = z.object({
    event: z.string(),
    year: z.number().min(1900).max(2025),
    award: z.string(),
  });
  
  export const gameSchema = z.object({
    name: z.string(),
    logo: imageSchema,
    backgroundImage: imageSchema,
    trailer: z.string().url(),
    screenshots: z.array(imageSchema),
    downloadLinks: z
      .array(
        z.object({
          platform: z.string(),
          link: z.string().url(),
        })
      )
      .optional(),
    reviews: z.array(reviewsSchema),
    awards: z.array(awardsSchema),
    platforms: z.array(z.string()),
  });


export function validateGame(game) {
    return gameSchema.safeParse(game);
}

export function validatePartialGame(game) {
    return gameSchema.partial().safeParse(game);
}

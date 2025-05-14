import z from 'zod';

const imageSchema = z.object({
    url: z.string().url(),
    public_id: z.string(),
    });

const websiteLinkSchema = z.object({
    website: z.string().url(),
    socialMedia: z.array(z.object({
        platform: z.string(),
        link: z.string().url(),
    })),
});

const contactInfoSchema = z.object({
    email: z.string().email(),
    phone: z.string().min(7).max(15),
});

const companySchema = z.object({

    name: z.string({ message : "Company name is required"}),
    contactInfo : contactInfoSchema,
    websiteLinks: websiteLinkSchema,
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    logo : imageSchema,
    contactInfo: z.object({
        email: z.string().email({ message: "Invalid email address." }),
        phone: z.string().min(15, { message: "Phone number must be at least 8 digits." }).max(16, { message: "Phone number must be at most 15 characters." }),
    }),

});

export function validateCompany(company) {
    return companySchema.safeParse(company);
}
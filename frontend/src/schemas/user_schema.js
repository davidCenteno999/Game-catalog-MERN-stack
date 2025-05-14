import z from 'zod';

export const userSchema = z.object({
  username: z.string({ message: "Username is required." }),
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).max(20, { message: "Password must be at most 20 characters." }),
  role: z.enum(['admin', 'user']).optional(),
});

export const userLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).max(20, { message: "Password must be at most 20 characters." }),
});

export const userUpdateSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).max(20, { message: "Username must be at most 20 characters." }).optional(),
  email: z.string().email({ message: "Invalid email format." }).optional(),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).max(20, { message: "Password must be at most 20 characters." }).optional(),
  role: z.enum(['admin', 'user']).optional(),
});


export const validateUserUpdate = (user) => {
    return userUpdateSchema.safeParse(user);
}

export function validateUser(user) {
    return userSchema.safeParse(user);
}

export function validatePartialUser(user) {
    return userSchema.partial().safeParse(user);

}

export function validateUserLogin(user) {
    return userLoginSchema.safeParse(user);
}

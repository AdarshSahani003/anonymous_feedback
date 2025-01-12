import {z} from 'zod';

export const forgotPasswordSchema = z.object({
    code: z.string().length(6,"OTP must be 6 digits"),
    password:z.string().min(3).max(20)
})
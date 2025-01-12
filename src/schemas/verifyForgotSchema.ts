import {z} from 'zod';

export const verifyForgotSchema = z.object({
    username: z.string(),
    code: z.string().length(6,"OTP must be 6 digits"),
    password:z.string().min(3).max(20)
})
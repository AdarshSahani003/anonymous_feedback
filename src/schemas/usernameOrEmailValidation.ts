import { z } from "zod";

export const usernameOrEmailValidation = z.string().min(3).max(30)
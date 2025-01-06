import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get("username")
        }
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0
                ? usernameErrors.join(", ")
                : "Invalid query parameter"
            }, { status: 400 })
        }

        const { username } = result.data
        const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified: true})
        if(existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: "Username is unique"
        })

    } catch (error: any) {
        console.error("Error checking username uniqueness", error.errors)
        return Response.json({
            success: false,
            message: "Error checking username uniqueness"
        }, { status: 500 })
        
    }

}
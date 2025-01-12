import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";
import bcrypt from "bcryptjs"


export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, code, password} = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(decodedUsername);

        const user = await UserModel.findOne(
            isEmail ? { email: decodedUsername } : { decodedUsername }
        );
        
        if(!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 500 })
        }
        const isCodeValid = user.verifyCode === code && user.verifyCodeExpiry > new Date();
        const hashedPassword = await bcrypt.hash(password, 10)

        if(isCodeValid) {
            user.isVerified = true
            user.password = hashedPassword
            await user.save()
            return Response.json({
                success: true,
                message: "Password changed successfully"
            }, { status: 200 })
        } else {
            return Response.json({
                success: false,
                message: "Invalid code or expired Code"
            }, { status: 400 })
        }


    } catch (error: any) {
        console.error("Error changing password", error.errors)
        return Response.json({
            success: false,
            message: "Error changing password"
        }, { status: 500 })
        
    }
}
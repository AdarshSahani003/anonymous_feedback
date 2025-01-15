import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function  POST(request: Request) {
    await dbConnect()

    try {
        const { value } = await request.json()
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const user = await UserModel.findOne(
            isEmail ? {email: value } : { username: value}
        )
        if(!user) {
            throw new Error("No user found")
        }
        const newVerifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const emailResponse = await sendVerificationEmail(
            user.email,
            user.username,
            newVerifyCode)
        if(!emailResponse.success) {
            return Response.json({
                success : false,
                message: emailResponse.message
            }, { status: 500 })
        }
        const expiryDate = new Date(Date.now() + 3600000)

        const newUser = await UserModel.findByIdAndUpdate(
            user._id,
            {
                verifyCode: newVerifyCode,
                verifyCodeExpiry: expiryDate
            },
            { new: true }
        )
        return Response.json({
            success : true,
            message: "Enter otp to reset password",
            username: newUser?.username
        }, { status: 201 })
    } catch (error) {
        console.error("Error sending verification email")
        return Response.json(
            {
                success: false,
                message: "Please enter correct credentials"
            },
            {
                status: 500
            }
        )
    }
}
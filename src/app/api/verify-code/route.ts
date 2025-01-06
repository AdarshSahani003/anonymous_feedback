import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})
        
        if(!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 500 })
        }
        if(user.isVerified) {
            return Response.json({
                success: false,
                message: "User already verified"
            }, { status: 500 })
        }
        const isCodeValid = user.verifyCode === code && user.verifyCodeExpiry > new Date();

        if(isCodeValid) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "User verified successfully"
            }, { status: 200 })
        } else {
            return Response.json({
                success: false,
                message: "Invalid code or expired Code"
            }, { status: 400 })
        }


    } catch (error: any) {
        console.error("Error verifying user", error.errors)
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, { status: 500 })
        
    }
}
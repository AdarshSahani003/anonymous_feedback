import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";
import bcrypt from "bcryptjs"

export async function GET(request: Request) {
    await dbConnect()

    try {
        const {identifier, password} = await request.json()
        const isEmail = identifier.includes('@');
        const query = isEmail ? { email: identifier } : { username: identifier };
        const existingUser = await UserModel.findOne(query)

        if(!existingUser) {
            return Response.json({
                success: false,
                message: "Wrong User or Email"
            }, { status: 400 })
        }

        const pass = await bcrypt.compare(password, existingUser.password)
        
        if(existingUser?.isVerified && pass){
            return Response.json({
                success: false,
                message: "Please verify your email"
            }, { status: 400 })
        }

        
    } catch (error) {
        
    }
}
import { getServerSession } from "next-auth"
import  { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/Users"
import { User } from "next-auth"


export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user

    if(!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {status: 401}
        )
    }

    const userId = user._id;
    const {acceptMessages} = await request.json()

    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages},
            { new: true }
        )
        if(!updateUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accept messages"
                }, { status: 500 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully"
            }, { status: 200 }
        )

    } catch (error) {
        console.log("failed to update user status to accept messages", error)
        return Response.json(
            {
                success: false,
                message: "falied to updaet user status to accept messages"
            }, { status: 500}
        )
    }
}

export async function GET() {
    await dbConnect();

    try {
        
        const session = await getServerSession(authOptions)
        const user: User = session?.user

        if(!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message: "Not Authenticated"
                }, {status: 401}
            )
        }

        const userId = user._id;
        const foundUser = await UserModel.findById(userId)
        if(!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, {status: 404}
            )
        }
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            }, {status: 200}
        )
    } catch (error) {
        console.log("failed to get user status of accepting messages", error)
        return Response.json(
            {
                success: false,
                message: "failed to get user status of accepting messages"
            }, { status: 500}
        )
    }
}
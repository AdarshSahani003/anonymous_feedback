import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import {ApiResponse} from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "adarshsahani003@gmail.com",
            to: email,
            subject: "MystryMessage | Verification Code",
            react: VerificationEmail({username, otp: verifyCode}),
        })
        return {success: true, message: "Verification code sent successfully"};
    } catch (emailError) {
        console.error("Error sending verification code email", emailError);
        return {success: false, message: "Failed to send verification code email"};
    }
}
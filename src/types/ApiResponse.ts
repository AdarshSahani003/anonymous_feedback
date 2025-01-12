import { Message } from "@/model/Users";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>;
    username?: string
}
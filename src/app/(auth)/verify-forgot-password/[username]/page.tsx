"use client"
import { useToast } from '@/hooks/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useParams } from 'next/navigation'
import { verifyForgotSchema } from '@/schemas/verifyForgotSchema'

const ForgotPasswordVerification = () => {
    const params = useParams<{username: string}>()
    console.log(params)
    const router = useRouter()
    const {toast} = useToast()
    const form = useForm<z.infer<typeof verifyForgotSchema>>({
        resolver: zodResolver(verifyForgotSchema),
        defaultValues:{
            username: "",
            code: "",
            password:""
        }
    })
    const onSubmit = async (data: z.infer<typeof verifyForgotSchema>) => {
        console.log("Submitting form data:", data)
        try {
            const response = await axios.post(`/api/forgot-password-verify`, {
                username: params.username,
                code: data.code,
                password: data.password
            })
            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace('/sign-in')
            
        } catch (error) {
            console.error("Error in password changing", error)
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast({
            title: "changing password failed",
            description: errorMessage,
            variant: "destructive"
            })
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your registered email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
            <FormItem>
                <FormLabel>Enter new Password</FormLabel>
                <FormControl><Input {...field} type="password" /></FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
 
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
    </div>
  )
}

export default ForgotPasswordVerification
"use client"
import { useToast } from '@/hooks/use-toast'
import { usernameOrEmailValidation } from '@/schemas/usernameOrEmailValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const forgotPassword = () => {
    const router = useRouter()
    const {toast} = useToast()

    const form = useForm<{username: string}>({
    resolver: zodResolver(z.object({ username: usernameOrEmailValidation })),
    defaultValues: {
      username: ""
    }
  })

  const onSubmit = async (data: {username: string}) => {
    try {
        const response = await axios.post(`/api/forgot-password`, {
            value: data.username
        })
        toast({
            title: "Success",
            description: response.data.message
        })
        router.replace(`/verify-forgot-password/${data.username}`)
    } catch (error) {
        console.error("Error in changing password", error)
        const axiosError = error as AxiosError<ApiResponse>;

        toast({
            title: "Signup failed",
            description: axiosError.response?.data.message,
            variant: "destructive"
        })
      }
    }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-xl font-extrabold tracking-tight lg:text-xl mb-6">
          Forgot Password Recovery
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Username or Email</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  </div>
);
}

export default forgotPassword
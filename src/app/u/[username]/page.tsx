'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApiResponse } from '@/types/ApiResponse'
import {useToast} from '@/hooks/use-toast'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function page() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const params = useParams<{username: string}>()
  const {toast} = useToast()

  const form = useForm<z.infer<typeof messageSchema>>({
  resolver: zodResolver(messageSchema),
  defaultValues: {
    content: ""
  }
  })

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post(`/api/send-message`, {
          username: params.username,
          content: data.content
      })
      toast({
          title: "Message sent successfully",
          description: response.data.message
      })
    } catch (error) {
        console.error("Error in sending message", error)
        const axiosError = error as AxiosError<ApiResponse>;

        toast({
            title: "Message failed",
            description: axiosError.response?.data.message,
            variant: "destructive"
        })
      }
      setIsSubmitting(false)
    }

  return (
    <div className='flex justify-center items-center bg-white min-h-screen'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Send Message
          </h1>
          <p className='mb-4'>Enter the message to send</p>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormLabel htmlFor='content'>Message</FormLabel>
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter message here...</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormMessage/>
          <Button type='submit' disabled={isSubmitting}>
            Send Message
          </Button>
        </form>
        </Form>
      </div>
    </div>
  )
}

export default page
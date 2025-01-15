'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApiResponse } from '@/types/ApiResponse'
import {useToast} from '@/hooks/use-toast'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'


function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const params = useParams<{ username: string }>();
  const username = params.username;
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
      form.reset({ ...form.getValues(), content: '' });
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
      
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isSubmitting ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      </div>
  )
}

export default Page
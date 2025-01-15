"use client"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { signInSchema } from "@/schemas/signInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"


const SignInForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }
    setIsSubmitting(false);

    if (result?.url) {
      router.replace('/');
    }
  };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Login True Feedback
                    </h1>
                    <p className="mb-4">SignIn to continue your anonymous adventure</p>
                </div>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    name="identifier"
                    control={form.control}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username or Email</FormLabel>
                        <Input {...field} name="Username" />
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <Input {...field} name="Password" />
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className='w-full' disabled={isSubmitting}>
                    {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                    </>
                    ) : (
                    'SignIn'
                    )}
                </Button>
                </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                    New to True Feedback?{' '}
                    <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                        Sign Up
                    </Link>
                    </p>
                </div>
                <div className="text-center mt-4">
                    <p>
                    <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800">
                        Forgot Password
                    </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignInForm
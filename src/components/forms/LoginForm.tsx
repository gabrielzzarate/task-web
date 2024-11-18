'use client'
import { useState } from 'react'
import { z, ZodError } from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'
import { ApiError } from '@/utils/errors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { login } from '@/api/auth'
import { Alert } from '../ui/alert'

// todo: add zod validation to the server route
const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address' }),
  password: z.string().trim()
})

type FormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email')
  const [error, setError] = useState<string | null>(null)
  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: email || '',
      password: ''
    }
  })

  async function onSubmit(data: FormValues) {
    console.log('data formvalues', data)
    try {
      const user = await login(data)
      console.log('user', user)
      if (user) {
        router.push(`/me`)
      }
    } catch (error) {
      console.log('error', error)
      if (error instanceof ApiError) {
        setError(error.message)
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-3'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Email' type='email' />
                </FormControl>
                {/* <FormDescription>Your emaill address.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Password' type='password' />
                </FormControl>
                {/* <FormDescription>Your password.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Login</Button>
          {error && <Alert variant='destructive'>{error}</Alert>}
        </div>
      </form>
    </Form>
  )
}

'use client'
import { z } from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signup } from '@/api/auth'
import { useState } from 'react'
import { ApiError } from '@/utils/errors'

// todo: add zod validation to the server route
const signupSchema = z
  .object({
    first_name: z.string().trim().min(1, { message: 'First name is required' }),
    last_name: z.string().trim().min(1, { message: 'Last name is required' }),
    email: z.string().trim().email({ message: 'Invalid email address' }),
    password: z.string().trim().min(8, { message: 'Password must be at least 8 characters long' }),
    confirm_password: z
      .string()
      .trim()
      .min(8, { message: 'Password must be at least 8 characters long' })
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirm_password']
      })
    }
  })

type FormValues = z.infer<typeof signupSchema>

export function SignupForm() {
  const searchParams = useSearchParams()
  const [formError, setFormError] = useState<string | null>(null)
  const router = useRouter()
  const email = searchParams.get('email')

  const form = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: 'Gabriel',
      last_name: 'Garcia',
      email: email || '',
      password: 'abcd1234678'
    }
  })

  async function onSubmit(data: FormValues) {
    try {
      const user = await signup(data)

      console.log('user', user)
      if (user) {
        router.push(`/me`)
      }
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message)
      } else {
        setFormError('An unexpected error occurred')
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='flex gap-2'>
          <FormField
            control={form.control}
            name='first_name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='First Name' autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='last_name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Last Name' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Email' type='email' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex gap-2'>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Password' type='password' />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirm_password'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Confirm Password' type='password' />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {formError && <Alert variant='destructive'>{formError}</Alert>}
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}

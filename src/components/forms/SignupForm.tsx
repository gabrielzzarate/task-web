'use client'
import { z } from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'
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
import { signup } from '@/api/auth'

// todo: add zod validation to the server route
const signupSchema = z.object({
  first_name: z.string().trim().min(1, { message: 'First name is required' }),
  last_name: z.string().trim().min(1, { message: 'Last name is required' }),
  email: z.string().trim().email({ message: 'Invalid email address' }),
  password: z.string().trim().min(8, { message: 'Password must be at least 8 characters long' })
})

type FormValues = z.infer<typeof signupSchema>

export function SignupForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email')
  const form = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: email || '',
      password: ''
    }
  })

  async function onSubmit(data: FormValues) {
    console.log('data formvalues', data)

    const user = await signup(data)

    if (user) {
      router.push(`/me`)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
                <FormDescription>Your emaill address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex gap-2'>
          <FormField
            control={form.control}
            name='first_name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='First Name' />
                </FormControl>
                <FormDescription>Your first name.</FormDescription>
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
                <FormDescription>Your last name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Password' type='password' />
                </FormControl>
                <FormDescription>Your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}

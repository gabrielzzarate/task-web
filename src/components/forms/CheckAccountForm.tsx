'use client'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { checkAccountExists } from '@/api/auth'

// todo: add zod validation to the server route
const checkAccountSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address' })
})

type FormValues = z.infer<typeof checkAccountSchema>

export function CheckAccountForm() {
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(checkAccountSchema),
    defaultValues: {
      email: 'gabrielzzarate@gmail.com'
    }
  })

  async function onSubmit(data: FormValues) {
    const userExists = await checkAccountExists(data.email)

    if (userExists) {
      router.push(`/auth/login?email=${data.email}`)
    }
    router.push(`/auth/login?email=${data.email}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <div className='flex flex-col gap-2'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Your email address' type='email' />
                </FormControl>
                {/* <FormDescription>Your emaill address.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Continue</Button>
        </div>
      </form>
    </Form>
  )
}

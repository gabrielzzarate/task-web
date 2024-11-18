export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background'>
      <div className='max-w-lg w-full'>{children}</div>
    </div>
  )
}

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-script text-6xl text-primary mb-4">404</h1>
        <h2 className="font-heading text-2xl text-foreground mb-2">Page Not Found</h2>
        <p className="text-foreground/60 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button variant="default">Go home</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Sign in</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

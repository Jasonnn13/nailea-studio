import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-secondary/15 flex items-center justify-center px-4">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-primary/15 via-accent/10 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-[350px] h-[350px] rounded-full bg-gradient-to-tl from-secondary/25 via-primary/10 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        <div className="relative inline-block mb-6">
          <h1 className="font-script text-8xl text-primary">404</h1>
          <span className="absolute -inset-6 bg-primary/10 blur-3xl rounded-full -z-10" />
        </div>
        <h2 className="font-heading text-3xl text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-5 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300">
              Go Home
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-foreground/15 text-foreground hover:bg-foreground/5 px-8 py-5 rounded-full bg-background/50 backdrop-blur-sm hover:-translate-y-0.5 transition-all duration-300">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

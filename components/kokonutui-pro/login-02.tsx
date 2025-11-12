'use client'
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Github, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Link from 'next/link'
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Login02Props extends React.HTMLAttributes<HTMLDivElement> {
    showGithub?: boolean;
    showGoogle?: boolean;
}

export default function Login02({


    
    showGithub = true,
    showGoogle = true,
    className,
    ...props
}: Login02Props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = createClient()
        setIsLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error
            router.push('/dashboard')
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'An error occurred')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card
            className={cn(
                "w-[400px] mx-auto rounded-3xl",
                "bg-white dark:bg-[#121212]",
                "border-2 border-zinc-100 dark:border-zinc-800/50",
                "shadow-[0_24px_48px_-12px] shadow-zinc-900/10 dark:shadow-black/30",
                className
            )}
            {...props}
        >
            <CardHeader className="space-y-4 px-8 pt-10">
                <div className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold bg-linear-to-r from-zinc-800 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-base text-zinc-500 dark:text-zinc-400">
                        Log in to your account
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="p-8 pt-4 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 bg-zinc-50 dark:bg-[#1a1a1a] border-zinc-200 dark:border-zinc-800/50"
                        />
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 bg-zinc-50 dark:bg-[#1a1a1a] border-zinc-200 dark:border-zinc-800/50"
                        />
                        <Button
                            className="w-full h-12 relative group overflow-hidden
                                bg-linear-to-r from-zinc-900 to-zinc-800 dark:from-white dark:to-zinc-200
                                text-white dark:text-[#121212] font-medium
                                shadow-lg shadow-zinc-200/20 dark:shadow-black/20
                                hover:from-indigo-500 hover:to-indigo-700 dark:hover:from-indigo-400 dark:hover:to-indigo-600
                                transition-all duration-300"
                        >
                        {isLoading ? 'Logging in...' : 'Login'}
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        </Button>
                    </div>
                    </form>

                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200 dark:border-zinc-800/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-[#121212] px-4 text-zinc-400 dark:text-zinc-500 font-medium">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {showGoogle && (
                        <Button
                            variant="outline"
                            className="h-12 relative group 
                                bg-zinc-50 dark:bg-[#1a1a1a]
                                hover:bg-white dark:hover:bg-[#222222]
                                border-zinc-200 dark:border-zinc-800/50
                                hover:border-zinc-300 dark:hover:border-zinc-700
                                ring-1 ring-zinc-100 dark:ring-zinc-800/50
                                transition duration-200"
                        >
                            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                Continue with Google
                            </span>
                        </Button>
                    )}

                    {showGithub && (
                        <Button
                            variant="outline"
                            className="h-12 relative group
                                bg-zinc-50 dark:bg-[#1a1a1a]
                                hover:bg-white dark:hover:bg-[#222222]
                                border-zinc-200 dark:border-zinc-800/50
                                hover:border-zinc-300 dark:hover:border-zinc-700
                                ring-1 ring-zinc-100 dark:ring-zinc-800/50
                                transition duration-200"
                        >
                            <Github className="mr-2 h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                Continue with GitHub
                            </span>
                        </Button>
                    )}
                </div>
            </CardContent>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>

            <CardFooter className="px-8 pb-10 pt-2">
                <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                    By continuing, you agree to our{" "}
                    <a
                        href="#"
                        className="text-zinc-800 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-200 
                        transition-colors underline underline-offset-4 decoration-zinc-200 dark:decoration-zinc-700
                        font-medium"
                    >
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                        href="#"
                        className="text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-200 
                        transition-colors underline underline-offset-4 decoration-zinc-200 dark:decoration-zinc-700
                        font-medium"
                    >
                        Privacy Policy
                    </a>
                </div>
            </CardFooter>
        </Card>
    );
}

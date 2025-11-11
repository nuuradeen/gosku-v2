"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cat, Eye, EyeOff } from "lucide-react";

import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'

export default function Signup01() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
          data: { first_name: firstName, last_name: lastName },

        },
        
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

    return (
        <div className="min-h-screen grid lg:grid-cols-[3fr_2.5fr] bg-gray-50 dark:bg-black/30">
            {/* Left side - Image background with content */}
            <div className="relative flex flex-col items-center justify-center p-8">
                {/* Background Image */}
                <div className="absolute inset-4 z-0 rounded-xl overflow-hidden">
                    <Image
                        src="/images/SquareClayBanks.jpg"
                        alt="Background"
                        fill
                        className="object-cover object-bottom opacity-85"
                        priority
                    />
                </div>

                {/* Content overlay */}
                <div className="relative z-10 text-center text-white space-y-6 max-w-md">
                    {/* Logo/Brand */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold tracking-tighter">
                            ❍ Go SKU
                        </h1>
                    </div>

                    {/* Main Title */}
                    <h2 className="text-3xl font-semibold leading-tight tracking-tighter">
                        Unlock the best of Go SKU. Access to AI inventory management for your Square POS and community UPC packs.
                    </h2>
                </div>
            </div>

            {/* Right side - Sign up form */}
            <div className="flex flex-col justify-center p-12">
                <div className="w-full max-w-lg mx-auto">
                    {/* Header */}
                    <div className="space-y-2 text-center mb-8">
                        <h1 className="text-2xl font-bold bg-linear-to-r from-zinc-800 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent tracking-tighter">
                            Create your account
                        </h1>
                        <p className="text-base text-zinc-500 dark:text-zinc-400 tracking-tighter">
                            Join our community today
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Social buttons row */}
                        <div className="grid grid-cols-2 gap-3">
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
                                <svg
                                    className="mr-2 h-5 w-5"
                                    viewBox="0 0 24 24"
                                >
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
                                <span className="font-medium text-zinc-700 dark:text-zinc-300 tracking-tighter">
                                    Sign in with Google
                                </span>
                            </Button>

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
                                <Cat className="mr-2 h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                                <span className="font-medium text-zinc-700 dark:text-zinc-300 tracking-tighter">
                                    Sign in with Github
                                </span>
                            </Button>
                        </div>

                        {/* Delimiter */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-zinc-200 dark:border-zinc-800/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-gray-50 dark:bg-black/30 px-4 text-zinc-400 dark:text-zinc-500 font-medium tracking-tighter">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        {/* Form inputs */}
                        <div className="space-y-4">
                            <form onSubmit={handleSignUp}>
                            {/* First name and Last name row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="firstName"
                                        className="text-sm font-medium text-zinc-700 dark:text-zinc-300 tracking-tighter"
                                    >
                                        First name
                                    </Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="John"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        className="h-12 bg-zinc-50 dark:bg-[#1a1a1a] border-zinc-200 dark:border-zinc-800/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="lastName"
                                        className="text-sm font-medium text-zinc-700 dark:text-zinc-300 tracking-tighter"
                                    >
                                        Last name
                                    </Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        className="h-12 bg-zinc-50 dark:bg-[#1a1a1a] border-zinc-200 dark:border-zinc-800/50"
                                    />
                                </div>
                            </div>

                            {/* Email full row */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300 tracking-tighter"
                                >
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 bg-zinc-50 dark:bg-[#1a1a1a] border-zinc-200 dark:border-zinc-800/50"
                                />
                            </div>

                            {/* Password full row */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300 tracking-tighter"
                                >
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Choose your password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 bg-zinc-50 dark:bg-[#1a1a1a] border-zinc-200 dark:border-zinc-800/50 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="repeat-password"
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300 tracking-tighter"
                                >
                                    Repeat password
                                </Label>
                                <Input
                                    id="repeat-password"
                                    type="password"
                                    placeholder="Repeat your password"
                                    required
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                    className="h-12 bg-zinc-50 dark:bg-[#1a1a1a] border-zinc-200 dark:border-zinc-800/50"
                                />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}

                            {/* Submit button */}
                            <Button
                                className="w-full h-12 relative group overflow-hidden
                            bg-linear-to-r from-zinc-900 to-zinc-800 dark:from-white dark:to-zinc-200
                            text-white dark:text-[#121212] font-medium
                            shadow-lg shadow-zinc-200/20 dark:shadow-black/20
                            hover:from-orange-500 hover:to-orange-700 dark:hover:from-orange-400 dark:hover:to-orange-600
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-300"
                            type="submit"
                            disabled={isLoading}

                            >
                               
                                <div className="relative flex items-center justify-center gap-2">
                                {isLoading ? 'Creating account...' : 'Create account'}
                                </div>
                            </Button>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6 tracking-tighter">
                            By continuing, you agree to our{" "}
                            <a
                                href="#"
                                className="text-zinc-800 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-200
                        transition-colors underline underline-offset-4 decoration-zinc-200 dark:decoration-zinc-700
                        font-medium tracking-tighter"
                            >
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a
                                href="#"
                                className="text-zinc-800 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-200
                        transition-colors underline underline-offset-4 decoration-zinc-200 dark:decoration-zinc-700
                        font-medium tracking-tighter"
                            >
                                Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { HeroHeader } from './hero5-header'
import Image from 'next/image'
import { useTheme } from 'next-themes'

const signUpSchema = z.object({
    name: z.string().min(1, "Username is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(5, "Password must be at least 5 characters"),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"]
});

export default function RegisterPage() {
    const {theme} = useTheme(); 
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({
        resolver: zodResolver(signUpSchema),
        mode: 'onBlur'
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('USER');
        if (storedUser) {
            router.push('/chats');
        }
    }, []);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            let response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            let { token, user } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            toast.success('Account created successfully!');
            router.push("/chats");

        } catch (error: any) {
            if (error.response?.data?.errors) {
                Object.entries(error.response.data.errors).forEach(([key, message]) => {
                    setError(key as "name" | "email" | "password" | "password_confirmation", {
                        type: "server",
                        message: message as string
                    });
                });
            } else {
                setError("root.serverError", {
                    type: "server",
                    message: "An unexpected error occurred."
                });
            }
            toast.error('Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    const handleSocialAuth = (provider: string) => {
        try {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}/redirect`;
        } catch (error) {
            console.log(error);
            toast.error(`Failed to connect with ${provider}`);
        }
    }

    return (
        <div>
            <HeroHeader />
            <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent w-full">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    action=""
                    className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
                    <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
                        <div className="text-center">
                            <Link
                                href="/"
                                aria-label="go home"
                                className="mx-auto block w-fit">
                                {theme === 'light' ? (
                                    <Image src="/logo-akyanpay.svg" alt="AkyanPay Logo" width={75} height={50} />

                                ) : (
                                    <Image src="/logo-akyanpay-dark.svg" alt="AkyanPay Logo" width={75} height={50} />

                                )}
                            </Link>
                            <h1 className="text-title mb-1 mt-4 text-xl font-semibold">Create a AKyanPay Account</h1>
                            <p className="text-sm">Welcome! Create an account to get started</p>
                        </div>

                        <div className="mt-6 space-y-6">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="block text-sm">
                                    Username
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="name"
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="block text-sm">
                                    Email
                                </Label>
                                <Input
                                    type="email"
                                    required
                                    id="email"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-0.5">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="pwd"
                                        className="text-title text-sm">
                                        Password
                                    </Label>
                                    
                                </div>
                                <Input
                                    type="password"
                                    required
                                    id="pwd"
                                    className="input sz-md variant-mixed"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-0.5">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="pwdconfirm"
                                        className="text-title text-sm">
                                        Password Confirmation
                                    </Label>
                                </div>
                                <Input
                                    type="password"
                                    required
                                    id="pwdconfirm"
                                    className="input sz-md variant-mixed"
                                    {...register("password_confirmation")}
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-500">{errors.password_confirmation.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : (
                                    'Create An Account'
                                )}
                            </Button>
                        </div>

                        <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                            <hr className="border-dashed" />
                            <span className="text-muted-foreground text-xs">Or continue With</span>
                            <hr className="border-dashed" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleSocialAuth('google')}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="0.98em"
                                    height="1em"
                                    viewBox="0 0 256 262">
                                    <path
                                        fill="#4285f4"
                                        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                    <path
                                        fill="#34a853"
                                        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                                    <path
                                        fill="#fbbc05"
                                        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                                    <path
                                        fill="#eb4335"
                                        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                                </svg>
                                <span>Google</span>
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleSocialAuth('github')}>
                                <img src={"/github.svg"} alt="github" className="w-4 h-4" />
                                <span>Github</span>
                            </Button>
                        </div>
                    </div>

                    <div className="p-3">
                        <p className="text-accent-foreground text-center text-sm">
                            Have an account ?
                            <Button
                                asChild
                                variant="link"
                                className="px-2">
                                <Link href="/login">Sign In</Link>
                            </Button>
                        </p>
                    </div>
                </form>
            </section>
        </div>
    )
}

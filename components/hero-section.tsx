"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Compass, Lightbulb, Users } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {

    return (
        <section className="w-full pt-32 pb-22 md:pt-48 bg-background">
            <div
                aria-hidden
                className="absolute inset-0 isolate z-10 hidden opacity-65 contain-strict lg:block">
                <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
            </div>
            <div className="container px-6 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 items-center">
                    <div className="flex justify-end relative">
                        
                        {/* SVG Mockup Placeholder - Replace with your actual SVG */}
                        <Image src="/mockup.svg" alt="AkyanPay Mockup" width={500} height={500} />

                    </div>
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-2 w-fit">
                            Developer Journey
                        </div>
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Your Personalized Path to Becoming a Developer
                        </h1>
                        <p className="text-muted-foreground text-lg md:text-xl">
                            AI-powered roadmaps, real mentor guidance, quizzes, code test, and code interviews — all in one place.
                        </p>
                        <p className="text-xl font-medium text-primary">Learn smarter. Build faster. Stay on track.</p>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button size="lg" className="gap-2">
                                Get Started <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline">
                                Learn More
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Compass className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-sm font-medium">Personalized Roadmaps</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-sm font-medium">Real Mentors</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Code className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-sm font-medium">Code Interviews</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Lightbulb className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-sm font-medium">Interactive Quizzes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
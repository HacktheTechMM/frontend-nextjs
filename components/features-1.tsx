import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BotMessageSquare, Brain, Code, LaptopMinimalCheck, UserRoundSearch, Users } from 'lucide-react'
import { ReactNode } from 'react'

export default function Features() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent" id='features'>
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Built to cover your needs</h2>
                    <p className="mt-4">No more guesswork. No more tab chaos. Just the tools, the path, and the people to help you actually get there.</p>
                </div>
                <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <BotMessageSquare />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">AI Mentor</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">Get a personalized learning roadmap in seconds by just chatting with our smart AI mentor.</p>                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <UserRoundSearch />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Guides From Senior</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">Stuck or confused? Get help and guidance from experienced developers, anytime you need.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Users />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Mettings With Mentor</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">Practice real-world coding problems and test your skills directly on the platform.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5 justify-items-center">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Code />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Codes Test With Us</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">Practice real-world coding problems and test your skills directly on the platform.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Brain />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Funny With Quizzs</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">Keep your learning fun and engaging with interactive quizzes after every topic.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <LaptopMinimalCheck />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Mock Interviews</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">Get ready for real interviews by practicing with AI-driven mock sessions.</p>
                        </CardContent>
                    </Card>



                </div>
            </div>
        </section >
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div aria-hidden className="bg-radial to-background absolute inset-0 from-transparent to-75%" />
        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)

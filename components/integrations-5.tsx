import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'

export default function IntegrationsSection() {
    const { theme } = useTheme();
    return (
        <section id='integrations'>
            <div className="py-24 md:py-32">
                <div className="max-w-sm overflow-hidden p-6 mx-auto">
                    <div className="aspect-16/10 group relative flex items-center justify-between">
                        <div
                            role="presentation"
                            className="bg-linear-to-b border-foreground/5 absolute inset-0 z-10 aspect-square animate-spin items-center justify-center rounded-full border-t from-lime-500/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100 dark:from-white/5"></div>
                        <div
                            role="presentation"
                            className="bg-linear-to-b border-foreground/5 absolute inset-16 z-10 aspect-square scale-90 animate-spin items-center justify-center rounded-full border-t from-blue-500/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100"></div>
                        <div className="bg-linear-to-b from-muted-foreground/15 absolute inset-0 flex aspect-square items-center justify-center rounded-full border-t to-transparent to-25%">
                            <IntegrationCard className="-translate-x-1/6 absolute left-0 top-1/4 -translate-y-1/4">
                                <Image src={"/google.svg"} alt="Python" width={75} height={50} />
                            </IntegrationCard>
                            <IntegrationCard className="absolute top-0 -translate-y-1/2">
                                <Image src={"/python-svgrepo-com.svg"} alt="Python" width={75} height={50} />
                            </IntegrationCard>
                            <IntegrationCard className="translate-x-1/6 absolute right-0 top-1/4 -translate-y-1/4">
                                <Image src={"/groq.png"} alt="Python" width={75} height={50} />

                            </IntegrationCard>
                        </div>
                        <div className="bg-linear-to-b from-muted-foreground/15 absolute inset-16 flex aspect-square scale-90 items-center justify-center rounded-full border-t to-transparent to-25%">
                            <IntegrationCard className="absolute top-0 -translate-y-1/2">
                                <Image src={"/FastAPI.svg"} alt="Python" width={75} height={50} />
                            </IntegrationCard>
                            <IntegrationCard className="absolute left-0 top-1/4 -translate-x-1/4 -translate-y-1/4">
                                <Image src={"/llama.svg"} alt="Python" width={75} height={50} />
                            </IntegrationCard>
                            <IntegrationCard className="absolute right-0 top-1/4 -translate-y-1/4 translate-x-1/4">
                                <Image src={"/google.svg"} alt="Python" width={75} height={50} />
                            </IntegrationCard>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 mx-auto my-2 flex w-fit justify-center gap-2">
                            <div className="bg-muted relative z-20 rounded-full border p-1">
                                <IntegrationCard
                                    className="shadow-black-950/10 dark:bg-background size-16 border-black/20 shadow-xl dark:border-white/25 dark:shadow-white/15"
                                    isCenter={true}>
                                    {theme === 'light' ? (
                                        <Image src="/logo-akyanpay.svg" alt="AkyanPay Logo" width={75} height={50} />

                                    ) : (
                                        <Image src="/logo-akyanpay-dark.svg" alt="AkyanPay Logo" width={75} height={50} />

                                    )}
                                </IntegrationCard>
                            </div>
                        </div>
                    </div>
                    <div className="bg-linear-to-t from-background relative z-20 mx-auto mt-12 max-w-lg space-y-6 from-55% text-center">
                        <h2 className="text-balance text-3xl font-semibold md:text-4xl">Built on Powerful Integrations</h2>
                        <p className="text-muted-foreground"> Our platform brings together the best tools in AI, backend, and cloud services — from LLaMA and Groq to FastAPI — to deliver a fast, intelligent, and personalized learning experience.</p>

                        <Button
                            variant="outline"
                            size="sm"
                            asChild>
                            <Link href="#">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

const IntegrationCard = ({ children, className, isCenter = false }: { children: React.ReactNode; className?: string; position?: 'left-top' | 'left-middle' | 'left-bottom' | 'right-top' | 'right-middle' | 'right-bottom'; isCenter?: boolean }) => {
    return (
        <div className={cn('relative z-30 flex size-12 rounded-full border bg-white shadow-sm shadow-black/5 dark:bg-white/5 dark:backdrop-blur-md', className)}>
            <div className={cn('m-auto size-fit *:size-5', isCenter && '*:size-8')}>{children}</div>
        </div>
    )
}

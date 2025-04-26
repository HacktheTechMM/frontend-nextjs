'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import Link from 'next/link'

type FAQItem = {
    id: string
    icon: IconName
    question: string
    answer: string
}

export default function FAQsThree() {
    const faqItems: FAQItem[] = [
        {
            id: 'item-1',
            icon: 'brain-circuit',
            question: 'How does the AI generate my learning roadmap?',
            answer: 'Our AI takes your goals, current skill level, and preferences to build a custom roadmap. It’s designed to guide you step-by-step — like a GPS for your coding journey.',
        },
        {
            id: 'item-2',
            icon: 'users',
            question: 'What if the AI doesn’t answer correctly?',
            answer: 'That’s why we have real mentors! You can chat or book sessions with experienced developers to clarify doubts, review your path, or just get solid advice.',
        },
        {
            id: 'item-3',
            icon: 'file-code',
            question: 'What kind of coding tests do you offer?',
            answer: 'We offer hands-on challenges in languages like JavaScript, Python, and more. You can practice real problems, get instant feedback, and track your progress.',
        },
        {
            id: 'item-4',
            icon: 'mic',
            question: 'Can I practice interviews here?',
            answer: 'Yes! You can take mock interviews powered by AI or real mentors. We simulate technical and behavioral rounds to help you feel confident and ready.',
        },
        {
            id: 'item-5',
            icon: 'smile',
            question: 'Is there anything fun to keep me engaged?',
            answer: 'Definitely! We’ve added quick quizzes and small rewards to make your learning journey more interactive and less stressful.',
        },
    ]
    

    return (
        <section className="bg-muted dark:bg-background py-20" id='q&a'>
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="flex flex-col gap-10 md:flex-row md:gap-16">
                    <div className="md:w-1/3">
                        <div className="sticky top-20">
                            <h2 className="mt-4 text-3xl font-bold">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground mt-4">
                                Can't find what you're looking for? Contact our{' '}
                                <Link
                                    href="#"
                                    className="text-primary font-medium hover:underline">
                                    customer support team
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full space-y-2">
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="bg-background shadow-xs rounded-lg border px-4 last:border-b">
                                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-6">
                                                <DynamicIcon
                                                    name={item.icon}
                                                    className="m-auto size-4"
                                                />
                                            </div>
                                            <span className="text-base">{item.question}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5">
                                        <div className="px-9">
                                            <p className="text-base">{item.answer}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}

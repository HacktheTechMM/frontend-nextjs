"use client";

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Page = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get('token');
    const message = searchParams.get('message');

    useEffect(() => {
        const userId = params.userId as string;

        if (userId && token) {
            localStorage.setItem('userId', userId);
            localStorage.setItem("token", token);
            router.push('/');
        } else {
            router.push(`/login?message=${encodeURIComponent(message)}`);
        }
    }, []);

    return (
        <div>Redirecting...</div>
    );
};

export default Page;

"use client"

import { redirect, useParams, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {

    const params = useParams();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        const userId = params.userId as string;
        if (userId && token) {
            localStorage.setItem('userId', userId);
            localStorage.setItem("token", token);
            redirect('/');
        }else{
            redirect('/login');
        }
    }, []);

    return (
        <div>page</div>
    )
}

export default page
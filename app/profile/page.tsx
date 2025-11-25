'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/services/useAuth';

export default function Profile() {
    const { user, loading } = useAuth();
    
    
    
    
    if (loading) return <p>Loading...</p>;
    return (<>
        <Link href="/main" className="block">
                    <button className="bg-red-300  text-white p-2 rounded w-full hover:bg-blue-400 cursor-pointer">
                        To Tests
                    </button>
        </Link>


    
    </>
    )
}
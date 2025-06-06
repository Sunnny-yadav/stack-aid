'use client'
import { useAuthStore } from '@/store/Auth'
import React, { useEffect } from 'react'
import {useRouter} from 'next/navigation'
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function Layout({children}:{children:React.ReactNode}){
    const {session} = useAuthStore();
    const router = useRouter();

    useEffect(()=>{
        if(session){
            router.push("/")
        }
    },[session])

    if(session) return null

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
          <BackgroundBeams />
          <div className="relative">{children}</div>
        </div>
      )
}
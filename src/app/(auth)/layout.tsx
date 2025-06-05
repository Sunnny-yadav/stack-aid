import { useAuthStore } from '@/store/Auth'
import React, { useEffect } from 'react'
import {useRouter} from 'next/navigation'

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
        <>
            <div>
                <div>{children}</div>
            </div>
        </>
    )
}
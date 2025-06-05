'use client'
import { useAuthStore } from '@/store/Auth'
import React, {  useState } from 'react'

export default function Login(){

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const {login} = useAuthStore()

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const formdata = new FormData(e.currentTarget)
            const email = formdata.get("email")
            const password = formdata.get("password")

            if(!email || !password){
                setError(()=> "All fields are requried");
                setIsLoading(false)
                return
            }

            const response = await login(email?.toString(), password?.toString())

            if(response.error){
                setError(()=> response.error!.message)
                setIsLoading(false)
                return
            }else{
                setIsLoading(false)
            }
        } catch (error) {
            console.log("(auth)/login ::",error)
        }
    }



    return (
        <>
            <div>
                Login form 
            </div>
        </>
    )
}
'use client'
import { useAuthStore } from '@/store/Auth';
import { Alegreya_SC } from 'next/font/google';
import React, { useState } from 'react'

export default function Register(){
    const [isLoading, setisLoading] = useState(false);
    const [error, setError] = useState("");
    const {createAccount, login} = useAuthStore()

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setisLoading(true)
        try {
            const formdata = new FormData(e.currentTarget);
            const firstName = formdata.get("firstName")
            const lastName = formdata.get("lastName")
            const email = formdata.get("email")
            const password = formdata.get("password")

            if(!firstName || !lastName || !email || !password){
                setError(()=> "All Fields are requried");
                return
            }

            const response = await createAccount(
                `${firstName} ${lastName}`,
                email.toString(),
                password.toString()
            );

            if(response.error){
                setError(()=> response.error!.message)
                setisLoading(false)
                return
            } else {
                const response = await  login(email.toString(), password.toString())

                if(response.error){
                    setError(()=> response.error!.message);
                    setisLoading(false);
                    return
                }else {
                    setisLoading(false)
                }
                
            }

        } catch (error) {
            console.log("(auth)/register ::",error)
        }
    }
    return (
        <>
            <div>
                Registration ui
            </div>
        </>
    )
}
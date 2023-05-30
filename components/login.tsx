'use client'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import './component_styles/login.css'

function Login() {
    return (
        <div className="logindiv1">
            <Image
            src="/NBA.png" alt="NBA Logo"
            width={70} height={160}/>
            <button onClick={() => signIn('google')}
            className="loginbtn">Sign In to use NBANewsletter</button>
        </div>
    )
}

export default Login;
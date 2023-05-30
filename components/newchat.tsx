'use client'

import './component_styles/newchat.css'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export default function NewChat() {
    const router = useRouter()
    const {data: session} = useSession()
    const createNewChat = async() => {
        const doc = await addDoc(
            collection(db, 'users', session?.user?.email!, 'chats'), {
                userId: session?.user?.email!,
                createdAt: serverTimestamp()
            }
        )
        router.push('/chat/' + doc.id)
    }
    return (
        <div onClick={createNewChat} className="newchatdiv1">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24"
            strokeLinecap="round" strokeLinejoin="round" className="newchatsvg"
            width="1em" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="7" x2="12" y2="21"></line>
                <line x1="5" y1="14" x2="19" y2="14"></line>
            </svg>
            New chat
        </div>
    )
}
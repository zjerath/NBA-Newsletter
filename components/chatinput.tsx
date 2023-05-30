'use client'

import './component_styles/chatinput.css'
import { useState, FormEvent } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { db } from '../firebase'
import { toast } from 'react-hot-toast'

type Props = {
    chatId: string
}

function adjustTextareaHeight(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
}

function ChatInput({ chatId }: Props) {
    const [prompt, setPrompt] = useState('')
    const { data: session } = useSession()
    const model = "text-davinci-003"
    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!prompt) return
        const textarea = document.querySelector('.chatinputtextarea') as HTMLTextAreaElement;
        textarea.style.height = '24px';
        const input = prompt.trim()
        setPrompt("")
        const message: Message = {
            text: input,
            createdAt: serverTimestamp(),
            user: {
                _id: session?.user?.email!,
                name: session?.user?.name!,
                avatar: session?.user?.image! || `https://ui-avatars.com/api/?name=${session?.user?.name}`,
            }
        }
        await addDoc(
            collection(db, 'users', session?.user?.email!, 'chats', chatId, 'messages'),
            message
        )
        const notification = toast.loading('NBANewsletter is thinking...')
        await fetch('../api/askquestion', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                prompt: input,
                chatId,
                model,
                session,
            })
        }).then(() => {
            toast.success('NBANewsletter has responded!', {
                id: notification,
            })
        })
    }
    return (
        <form onSubmit={sendMessage} className="chatinputform">
            <div className="chatinputdiv10">
                <div>
                    <div className="chatinputdiv11"></div>
                </div>
                <div className="chatinputdiv12">
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onInput={adjustTextareaHeight}
                        placeholder="Send a message"
                        className="chatinputtextarea"
                        style={{ maxHeight: '200px', overflowY: 'hidden' }}
                        rows={1}
                    />
                    <a href="">
                        <button disabled={!prompt} type="submit" className={`chatinputbtn ${prompt && 'inputhover'}`}>
                            <svg stroke="currentColor" fill="none" stroke-width="2" 
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" 
                            className="chatinputsvg2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </a>
                </div>
            </div>
        </form>
    )
}

export default ChatInput;
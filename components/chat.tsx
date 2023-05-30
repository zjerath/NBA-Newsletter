'use client'
import './component_styles/chat.css'
import { useSession } from 'next-auth/react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import Message from './message'
import Image from 'next/image'
import React, { useState } from 'react';
import { Instructions } from './instructions'

type Props = {
    chatId: string
}

function Chat({ chatId }: Props) {
    const { data: session } = useSession()
    const [messages] = useCollection(
        session &&
            query(
                collection(
                    db,
                    'users',
                    session?.user?.email!,
                    'chats',
                    chatId,
                    'messages'
                ),
                orderBy('createdAt', 'asc')
            )
    )
    const [open, setOpen] = useState(false);
    return <div className="chatdiv">
        {messages?.empty && (
            <div className="div4">
                <div className="div5">
                <Image className="nbaimg"
                src="/NBA.png" alt="NBA Logo"
                width={35} height={80}/>
                <h1 className="h1">
                    NBANewsletter
                    <button className={`popup-button ${open ? 'active' : ''}`} onClick={() => setOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" className="svginfo">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path>
                        </svg>
                    </button>
                </h1>
                {open && <Instructions openModal={open} setOpenModal={setOpen}/>}
                <div className="div6">
                    <div className="div7">
                    <h2 className="h2">
                        <svg stroke="currentColor" fill="none" 
                        stroke-width="1.5" viewBox="0 0 24 24" 
                        stroke-linecap="round" className="svg">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                        Examples
                    </h2>
                    <ul style={{padding: 0}} className="ul">
                        <li className="li">
                        "What was Curry's shooting percentage last night?"
                        </li>
                        <li className="li">
                        "Analyze my bets:
                        Kevin Durant, Phoenix, Assits, Under." 
                        </li>
                        <li className="li">
                        "How many points does Lebron average against the Warriors?"
                        </li>
                    </ul>
                    </div>
                    <div className="div7">
                    <h2 className="h2">
                        <svg stroke="currentColor" fill="none" 
                        stroke-width="1.5" viewBox="0 0 24 24" 
                        aria-hidden="true" height="1em" width="1em"
                        xmlns="http://www.w3.org/2000/svg" className="svg">
                        <path stroke-linecap="round" stroke-linejoin="round" 
                        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path>
                        </svg>
                        Capabilities
                    </h2>
                    <ul style={{padding: 0}} className="ul">
                        <li className="li">
                        Allows user to ask about any game, past or present
                        </li>
                        <li className="li">
                        Leverages current statistics against historical averages
                        </li>
                        <li className="li">
                        Trained to understand both if and why user bets hit or missed
                        </li>
                    </ul>
                    </div>
                    <div className="div7">
                    <h2 className="h2">
                        <svg stroke="currentColor" fill="none" 
                        stroke-width="1.5" viewBox="0 0 24 24" 
                        stroke-linecap="round" stroke-linejoin="round"
                        height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" 
                        className="svg">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        Limitations
                    </h2>
                    <ul style={{padding: 0}} className="ul">
                        <li className="li">
                        Inputted bets must be comma separated
                        </li>
                        <li className="li">
                        May occasionally produce incorrect or biased advice
                        </li>
                        <li className="li">
                        Unable to process bets made offline
                        </li>
                    </ul>
                    </div>
                </div>
                </div>
            </div>
        )}
        {messages?.docs.map((message) => (
            <Message key={message.id} message={message.data()} />
        ))}
    </div>
}

export default Chat;
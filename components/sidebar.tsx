'use client'

import './component_styles/sidebar.css'
import NewChat from './newchat'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { db } from '../firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, query, orderBy } from 'firebase/firestore'
import ChatRow from './chatrow'

export default function SideBar() {
    const [showPopout, setShowPopout] = useState(false)
    const { data: session } = useSession()
    const [chats, loading, error] = useCollection(
        session && 
        query(
            collection(db, 'users',  session.user?.email!, 'chats'),
             orderBy('createdAt', 'desc')
        )
    )
    return (
        <div className="sidebardiv1">
            <div className="sidebardiv2">
                <nav className="sidebarnav">
                    <NewChat/>
                    <div className="sidebarnavinner1">
                        <div className="sidebarnavinner2">
                            {chats?.docs.map(chat => (
                                <ChatRow key={chat.id} id={chat.id} />
                            ))}
                        </div>
                    </div>
                </nav>
            </div>
            {session && (
                <div className="sidebarbottom">
                    <div className="sidebarbottominner">
                        <button className="sidebarbtn" 
                        type="button" onClick={() => setShowPopout(!showPopout)}>
                            <div className="sidebaruserimg">
                                <div className="userimginner">
                                    <span>
                                        <span style={{ boxSizing: 'border-box', display: 'inline-block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'relative', maxWidth: '100%' }}>
                                        </span>
                                        <img alt="User" src={session.user?.image!}
                                        decoding="async" className="userimg" style={{position: 'absolute', inset: 0, boxSizing: 'border-box', padding: 0, border: 'none', margin: 'auto', display: 'block', width: 0, height: 0, minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%',}}>
                                        </img>
                                    </span>
                                </div>
                            </div>
                            <div className="username">{session.user?.name!}</div>
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24"
                            strokeLinecap="round" strokeLinejoin="round" className="dots"
                            height="1em" width="1em" xmlns="https://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="19" cy="12" r="1"></circle>
                                <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                            {showPopout && (
                                <div className="popout">
                                    <button onClick={() => signOut()}>
                                        <svg stroke="currentColor" fill="none" strokeWidth="2"
                                        viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"
                                        className="logoutsvg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                        <div className="logout">
                                            Log out
                                        </div>
                                    </button>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            )
            }
        </div>
    )
}
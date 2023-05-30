import '../../styles/chatpage.css'
import Chat from '../../../components/chat'
import ChatInput from '../../../components/chatinput'

type Props = {
    params: {
        id: string
    }
}

function ChatPage({params: { id }}: Props) {
    return (
        <div className="chatpagemain">
            <div className="chatpagediv1">
                <div className="chatpagediv2">
                    <div className="chatpagediv3">
                        <div className="chatpagediv4">
                            <Chat chatId={id}/>
                            <div className="chatpagediv8"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="chatpagediv9">
                <ChatInput chatId={id}/>
                <div className="chatpagediv13">
                    <span>
                        NBANewsletter is not liable for any bets you place as a result of using our application
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ChatPage;
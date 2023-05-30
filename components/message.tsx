import { DocumentData } from 'firebase/firestore'
import './component_styles/message.css'

type Props = {
    message: DocumentData;
}

function Message({ message }: Props) {
    const isNBA = message.user.name === "NBANewsletter"
    const cleanedText = message.text.replace(/^\W+/, '')
    return (
        <div className={`messageouter1 ${isNBA && "nba-bg"}`}>
            <div className="messageouter2">
                <div className="imageouter1">
                    <div className="imageouter2">
                        <img src={message.user.avatar} 
                        alt="avatar" 
                        className="messageimg"
                        style={{ position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '50px', height: '50px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%', borderRadius: '2px'}} />
                    </div>
                </div>
                <div className="textouter1">
                    <div className="textouter2">
                        {cleanedText}
                    </div>
                    <div className="textunder"></div>
                </div>
            </div>
        </div>
    )
}

export default Message
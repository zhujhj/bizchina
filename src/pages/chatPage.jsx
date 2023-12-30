import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from 'react-chat-engine-advanced'
import { useParams } from "react-router-dom";

import './chatPage.css';

const ChatPage = () => {
    const { chatUser } = useParams();

    const chatProps = useMultiChatLogic(
        'd00b15d8-699b-4210-a469-8d4da48dadbd', // CHATENGINE PROJECT ID
         chatUser,
        chatUser
    );
    return (
        <div style={{ height: '100vh'}}>
            <MultiChatSocket {...chatProps} />
            <MultiChatWindow {...chatProps} style={{ height: '100%'}} />
        </div>
    )
}

export default ChatPage
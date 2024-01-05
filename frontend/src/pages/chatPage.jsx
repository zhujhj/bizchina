import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from 'react-chat-engine-advanced'
import { useParams } from "react-router-dom";

import './chatPage.css';
import {getAuth} from "firebase/auth";

const ChatPage = () => {
   let chatUser = getAuth().currentUser.email
    const chatProps = useMultiChatLogic(
        '96035d14-d8b9-4c56-bfd6-d64fd0fdd566', // CHATENGINE PROJECT ID
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
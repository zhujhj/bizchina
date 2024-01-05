import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from 'react-chat-engine-advanced';

import { getAuth } from 'firebase/auth';
import './chatPage.css';

const ChatPage = () => {
    
    const user = getAuth().currentUser;

    const chatProps = useMultiChatLogic(
        '96035d14-d8b9-4c56-bfd6-d64fd0fdd566', // CHATENGINE PROJECT ID
         user.email,
        user.email
    );
    return (
        <div style={{ height: '100vh'}}>
            <MultiChatSocket {...chatProps} />
            <MultiChatWindow {...chatProps} style={{ height: '100%'}} />
        </div>
    )
}

export default ChatPage
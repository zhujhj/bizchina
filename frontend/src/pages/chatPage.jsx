import React from 'react';
import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from 'react-chat-engine-advanced';
import { useParams } from 'react-router-dom';

const ChatPage = () => {

    const { user } = useParams();
    console.log("Chat" + user)
    const chatProps = useMultiChatLogic(
        '96035d14-d8b9-4c56-bfd6-d64fd0fdd566',
        user,
        user
    );

    return (
        <div style={{ height: '100vh' }}>
            <MultiChatSocket {...chatProps} />
            <MultiChatWindow {...chatProps} style={{ height: '100%' }} />
        </div>
    );
};

export default ChatPage;

import React, { useEffect, useState } from 'react';
import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from 'react-chat-engine-advanced';
import { getAuth } from 'firebase/auth';
import './chatPage.css';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';

const ChatPage = () => {
    const [chatUser, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const firestore = firebase.firestore();
    const { user } = useParams();
    const collection = firestore.collection('users').doc(user);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data...');
                const doc = await collection.get();

                if (!doc.exists) {
                    console.error('Document not found');
                    return;
                }

                const userData = doc.data();
                console.log('User data:', userData);
                setUser(userData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [collection]);

    return (
        <ChatContent chatUser={chatUser} loading={loading} />
    );
};

const ChatContent = ({ chatUser, loading }) => {
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!chatUser) {
        console.error('User data not available');
        return null;
    }

    console.log("Chat" + chatUser.email);

    const chatProps = useMultiChatLogic(
        '96035d14-d8b9-4c56-bfd6-d64fd0fdd566',
        chatUser.email,
        chatUser.email
    );

    return (
        <div style={{ height: '100vh' }}>
            <MultiChatSocket {...chatProps} />
            <MultiChatWindow {...chatProps} style={{ height: '100%' }} />
        </div>
    );
};

export default ChatPage;

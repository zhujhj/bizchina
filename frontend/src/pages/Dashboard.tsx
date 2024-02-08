import { Container, Heading, SimpleGrid } from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Navbar from '../Navbar.jsx';
import Column from '../dashboard/components/Column.tsx';
import DarkModeIconButton from '../dashboard/components/DarkModeIconButton.tsx';
import { ColumnType } from '../dashboard/utils/enums.ts';
import './dashboard.css';
import {useParams} from "react-router-dom";
import Bookmarks from '../dashboard/components/Bookmarks.tsx';
import firebase from "firebase/compat/app";
import {MultiChatSocket, MultiChatWindow, useMultiChatLogic} from "react-chat-engine-advanced";

function Dashboard() {
    let { user } = useParams();
    const [loading, setLoading] = useState(true);
    const [chatUser, setUser] = useState(null);
    const firestore = firebase.firestore();
    const collection = firestore.collection('users').doc(user);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doc = await collection.get();

                if (!doc.exists) {
                    return;
                }

                const userData = doc.data();
                setUser(userData);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    return <DashboardContent chatUser={chatUser} loading={loading} />
}
const DashboardContent = ({ chatUser, loading }) => {
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!chatUser) {
        return null;
    }

    let {user} = useParams();
    const chatProps = useMultiChatLogic(
        '6f68f48b-34a7-48aa-89f8-6a59e7ca71e9', // CHATENGINE PROJECT ID
        chatUser.name,
        chatUser.name
    );

    return (
        <main>
            <div className='navbar-container'>
                <Navbar user={user} />
            </div>

            {/* <Heading
        fontSize={{ base: '4xl', sm: '5xl', md: '6xl' }}
        fontWeight="bold"
        textAlign="center"
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        bgClip="text"
        mt={4}
      >
        BizChina Dashboard
      </Heading> */}
            <DarkModeIconButton position="absolute" top={0} right={2} zIndex={100} />
            <Bookmarks />
            <DndProvider backend={HTML5Backend}>
                <Container maxWidth="container.lg" px={4} py={10}>
                    <SimpleGrid
                        columns={{ base: 1, md: 4 }}
                        spacing={{ base: 16, md: 4 }}
                    >
                        <Column column={ColumnType.TO_DO} chatUser = {chatUser}/>
                        <Column column={ColumnType.IN_PROGRESS} chatUser = {chatUser}/>
                        <Column column={ColumnType.BLOCKED} chatUser = {chatUser}/>
                        <Column column={ColumnType.COMPLETED} chatUser = {chatUser}/>
                    </SimpleGrid>
                </Container>
            </DndProvider>
        </main>
    );
};
export default Dashboard;
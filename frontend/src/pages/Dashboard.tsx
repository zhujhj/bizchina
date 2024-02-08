import { Container, Heading, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Navbar from '../Navbar.jsx';
import Column from '../dashboard/components/Column.tsx';
import DarkModeIconButton from '../dashboard/components/DarkModeIconButton.tsx';
import { ColumnType } from '../dashboard/utils/enums.ts';
import './dashboard.css';
import {useParams} from "react-router-dom";
import Bookmarks from '../dashboard/components/Bookmarks.tsx';

function Dashboard() {
    let { user } = useParams();
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
                        <Column column={ColumnType.TO_DO} user = {user}/>
                        <Column column={ColumnType.IN_PROGRESS} user = {user}/>
                        <Column column={ColumnType.BLOCKED} user = {user}/>
                        <Column column={ColumnType.COMPLETED} user = {user}/>
                    </SimpleGrid>
                </Container>
            </DndProvider>
        </main>
    );
}

export default Dashboard;
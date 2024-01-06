import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';

import './firebaseConfig.js';

import 'firebase/compat/analytics';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import ChakraDashBoard from './pages/ChakraDashboard.tsx';
import Calendar from './pages/calendar.jsx';
import ChatPage from "./pages/chatPage";
import SignIn from './pages/signInPage';


const auth = getAuth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

    const [user] = useAuthState(auth);
    const [chatUser, setUser] = useState(undefined);

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<SignIn onAuth={(chatUser) => setUser(chatUser)} />} />
                    <Route path="/chat/:user" element={<ChatPage />} />
                    <Route path="/dashboard/:user" element={<ChakraDashBoard />} />
                    <Route path="/calendar" element={<Calendar />} />
                    
                </Routes>
            </Router>
        </>
    )
}

export default App;


        

import axios from 'axios';
import React, { useState } from 'react';
import './signInPage.css';

import '../firebaseConfig.js';

import 'firebase/compat/analytics';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import logo from '../images/logo.png';

import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithPopup,signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const auth = getAuth();

const SignIn = (props) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State variable to hold error message

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                navigate(`/dashboard/${user.uid}`);
            })
            .catch((error) => {
                setError(error.message); // Set error message
            });
    }

    const handleCreateAccount = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                navigate(`/dashboard/${user.uid}`);
            })
            .catch((error) => {
                setError(formatErrorMessage(error.code)); // Set error message
            });
    }

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                navigate(`/dashboard/${user.uid}`);
            })
            .catch((error) => {
                setError(formatErrorMessage(error.code)); // Set error message
            });
    }

    return (
        <div id="signInContainer">
            <a href="https://www.ubcchinaforum.com/" target="_blank"> <img src={logo} id="logo" alt="Logo"></img> </a>
            <div id="signInTitle">Welcome</div>
            <div id="manage">Log in to start managing your tasks!</div>

            <input
                className="userInput"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="userInput"
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {/* Display error message if there's an error */}
            {error && <div style={{ color: 'red', marginTop: '-10px' }}>{error}</div>}

            <button id="login" onClick={handleSignIn}>Sign in</button>
            <button id="login" onClick={handleCreateAccount}>Create Account</button>
            <button type="button" className="login-with-google-btn" onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    );
}
const formatErrorMessage = (message) => {
    return message.replace('auth/', '').replace(/-/g, ' ');
}

function SignOut() {
    return auth.currentUser && (
        <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    );
}

export default SignIn;

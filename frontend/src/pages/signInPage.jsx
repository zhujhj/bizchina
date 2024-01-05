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

import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const auth = getAuth();

// function SignIn(props) {
const SignIn = (props) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user] = useAuthState(auth);

    const signInWithGoogle = (props) => {
        const provider = new firebase.auth.GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // console.log(user);
                await axios.post(
                    'http://localhost:3001/authenticate',
                    {username: user.email}
                )
                .then(r => props.onAuth({...r.data, secret: user.email}))
                .catch(e => console.log('error', e))
                // to be changed, hoping to use navigate.push for optimal performance.
                navigate(`/dashboard`);

                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }

    const signUpWithEmailAndPassword = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                let user = userCredential.user;
                axios.post(
                    'http://localhost:3001/authenticate',
                    {username: user.email}
                )
                    .then(r => props.onAuth({ ...r.data, secret: user.email}))
                    .catch(e => console.log('error', e))
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });

    };
    
    return (
        <div id="signInContainer">
            <a href="https://www.ubcchinaforum.com/"> <img src={logo} id="logo"></img> </a>
            <div id="signInTitle">Sign In</div>
            <div id="manage">Log in to start managing your tasks!</div>

            {/* Email and Password inputs */}
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {/* Sign in buttons */}
            <button id="login" onClick={signUpWithEmailAndPassword}>Sign in</button>
            <button id="signinGoogle" onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    )

}

function SignOut() {
    return auth.currentUser && (
        <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    )
}

export default SignIn;
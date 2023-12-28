import React, { useState } from 'react';
import '../signInPage.css';
import axios from 'axios'

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




function SignIn(props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signInWithGoogle = (props) => {
        const provider = new firebase.auth.GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                let user = result.user;
                console.log(user);
                await axios.post(
                    'http://localhost:3001/authenticate',
                    {username: 'John'}
                )
                    .then(r => props.onAuth({...r.data, secret: user.uid}))
                    .catch(e => console.log('error', e))
                // to be changed, hoping to use navigate.push for optimal performance.
                window.location.href = "/chat";
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
                    {username: user.uid}
                )
                    .then(r => props.onAuth({ ...r.data, secret: user.uid}))
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
            <img src={logo} className="logo"></img>
            <div id="signIn">Sign in</div>
            <div id="manage">Log in to start managing your tasks!</div>

            {/* Email and Password inputs */}
            <input
                type="text"
                placeholder="Email"
                className="inputBox"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="inputBox"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {/* Sign in buttons */}
            <button id="login" onClick={signUpWithEmailAndPassword}>Login</button>
            <button id="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    )

}

function SignOut() {
    return auth.currentUser && (
        <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    )
}

export default SignIn;
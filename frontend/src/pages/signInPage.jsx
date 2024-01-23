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

// function SignIn(props) {
const SignIn = (props) => {
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
                const user = result.user;
                // console.log(user);
                await axios.post(
                    'http://localhost:3001/authenticate',
                    {username: user.email}
                )
                .then(r => props.onAuth({...r.data, secret: user.email}))
                .catch(e => console.log('error', e))
                // to be changed, hoping to use navigate.push for optimal performance.
                navigate(`/dashboard/${user.uid}`);

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


    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            navigate(`/dashboard/${user.uid}`);// ...
        })
        .catch((err) => {
            if (err.code === "auth/email-already-in-use"){
                signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        // Signed in
                        const user = userCredential.user;
                        navigate(`/dashboard/${user.uid}`);
                    })
                    .catch((err) => {
                        console.log(err.code);
                        console.log(err.message);
                    });
            }
            console.log(err.code);
            console.log(err.message);
        });

    
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
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {/* Sign in buttons */}
            <button id="login" onClick={createUserWithEmailAndPassword}>Sign in</button>
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
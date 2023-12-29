import React, {useState} from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';

import './firebaseConfig.js';

import 'firebase/compat/analytics';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import SignIn from './pages/signInPage';
import ChatsPage from "./pages/ChatsPage";
import { getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';


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
                    <Route path="/chat/:chatUser" element={<ChatsPage />} />
                </Routes>
            </Router>
        </>
    )
}

export default App;


        
        // <div className="App">
        //     <header>
        //         <h1><img src={logo} className='logo'></img></h1>
        //         <SignOut />
        //     </header>

        //     {/* <section>
        //         {user ? <ChatRoom /> : <SignIn />}
        //     </section> */}

        // </div>
//     );
// }

// function SignIn() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const signInWithGoogle = () => {
//         const provider = new firebase.auth.GoogleAuthProvider();
//         signInWithPopup(auth, provider)
//             .then((result) => {
//                 // This gives you a Google Access Token. You can use it to access the Google API.
//                 const credential = GoogleAuthProvider.credentialFromResult(result);
//                 const token = credential.accessToken;
//                 // The signed-in user info.
//                 const user = result.user;
//                 // IdP data available using getAdditionalUserInfo(result)
//                 // ...
//             }).catch((error) => {
//             // Handle Errors here.
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             // The email of the user's account used.
//             const email = error.customData.email;
//             // The AuthCredential type that was used.
//             const credential = GoogleAuthProvider.credentialFromError(error);
//             // ...
//         });
//     }
//     const signUpWithEmailAndPassword = () => {
//         createUserWithEmailAndPassword(auth, email, password)
//             .then((userCredential) => {
//                 // Signed up
//                 const user = userCredential.user;
//                 // ...
//             })
//             .catch((error) => {
//                 const errorCode = error.code;
//                 const errorMessage = error.message;
//                 // ..
//             });

//     };
//     return (
//         <div id="signInContainer">
//             <div id="signIn">Sign in</div>
//             <div id="manage">Log in to start managing your tasks!</div>

//             {/* Email and Password inputs */}
//             <input
//                 type="text"
//                 placeholder="Email"
//                 className="inputBox"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//             />
//             <input
//                 type="password"
//                 placeholder="Password"
//                 className="inputBox"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//             />

//             {/* Sign in buttons */}
//             <button id="login" onClick={() => signUpWithEmailAndPassword(email, password)}>Login</button>
//             <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
//         </div>
//     )

// }

// function SignOut() {
//     return auth.currentUser && (
//         <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
//     )
// }


// function ChatRoom() {
//     const dummy = useRef();
//     const messagesRef = firestore.collection('messages');
//     const query = messagesRef.orderBy('createdAt');

//     const [messages] = useCollectionData(query, { idField: 'id' });

//     const [formValue, setFormValue] = useState('');


//     const sendMessage = async (e) => {
//         e.preventDefault();

//         const { uid, photoURL } = auth.currentUser;

//         await messagesRef.add({
//             text: formValue,
//             createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//             uid,
//             photoURL
//         })

//         setFormValue('');
//         dummy.current.scrollIntoView({ behavior: 'smooth' });
//     }

//     return (<>
//         <main>

//             {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

//             <span ref={dummy}></span>

//         </main>

//         <form onSubmit={sendMessage}>

//             <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

//             <button type="submit" disabled={!formValue}>🕊️</button>

//         </form>
//     </>)
// }


// function ChatMessage(props) {
//     const { text, uid, photoURL } = props.message;

//     const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

//     return (<>
//         <div className={`message ${messageClass}`}>
//             <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
//             <p>{text}</p>
//         </div>
//     </>)
// }


// export default App;
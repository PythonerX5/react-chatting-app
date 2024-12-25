import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import {getFirestore , query, collection} from "firebase/firestore"
import {useAuthState} from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore";
import {Suspense} from "react";


const firebaseConfig = {
    apiKey: "AIzaSyBJntSynHRXgr5ztQNQIS9PNKob9GPhXkg",
    authDomain: "react-chatting-app-86d6d.firebaseapp.com",
    projectId: "react-chatting-app-86d6d",
    storageBucket: "react-chatting-app-86d6d.firebasestorage.app",
    messagingSenderId: "798714672682",
    appId: "1:798714672682:web:247ce140fd60b42761f553",
    measurementId: "G-1CYKM4H8XF"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

function App() {

    const [ user ] = useAuthState(auth);

    return (
    <div className="max-w-6xl mx-auto">
        <header className="border-b p-2 flex justify-between">
            <h2 className="text-2xl font-bold text-black">
                WhatTheFuckApp
            </h2>
            {user && <SignOut/>}
        </header>
        {user ? (
            <>
                <MessageList />
                <MessageBar />
            </>
        ) : (
            <SignIn />
        )}


    </div>
  )
}



function SignIn(){

    function handleClick(){
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    }

    return(
        <div className="flex items-center justify-center p-5">
            <button
            onClick={handleClick}
                className="w-48 h-20 bg-blue-400 text-white font-bold rounded-[50px]">
                Google Ile Giris Yap!
            </button>
        </div>
    )
}

function SignOut(){
    return (
        <button
            onClick={()=> signOut(auth)}
            className="w-28 h-12 bg-red-600 text-white font-bold rounded-[50px]">
            Cikis Yap!
        </button>
    )
}

function MessageList() {
    const messagesRef = collection(db, "messages");
    const [messagesSnapshot, error] = useCollection(query(messagesRef));


    if (error) return <p>Hata: {error.message}</p>;
    if (!messagesSnapshot?.docs.length) return (<p> Burada hic mesaj yok! </p>)


    return (
        <div>
        {messagesSnapshot?.docs.map((doc) => (
                <div key={doc.id}>
                    {doc.data().text}
                </div>
            ))}
        </div>
    );
}

function MessageBar(){
    return(
        <div className="flex ">
            <form>
                <input type="text"
                    className="border-gray-500 border rounded-lg p-2"/>
                <button type="submit" className="w-32 h-12 mx-12 bg-blue-400 text-white font-bold rounded-[50px]">
                    Gonder
                </button>
            </form>
        </div>
    )
}


export default App

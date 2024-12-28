import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import {getFirestore , collection} from "firebase/firestore"
import {useAuthState} from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore";
import { useState, useEffect } from "react";
//import {Suspense} from "react";


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
                ShutTheFuckApp
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
    const [isLoading, setIsLoading] = useState(true);
    const messagesRef = collection(db, "messages");
    const [messagesSnapshot, loading, error] = useCollection(messagesRef);


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading || loading) return <p>Yükleniyor...</p>;
    if (error) return <p>Hata: {error.message}</p>;
    if (!messagesSnapshot?.docs.length) return (
        <div className="flex items-center justify-center my-12 ">
            <p className="flex items-center justify-center my-12 bg-gray-300 h-12 rounded-[15px] text-xl max-w-6xl px-12"> Yeni Bir Mesaj
                Gondermeyi Dene!</p>
        </div>

    )


    return (
        <div className="top-0 pl-4">
            {messagesSnapshot?.docs.map((doc) => (
                <div key={doc.id} className="border  my-4">
                    {doc.data().text}
                </div>
            ))}
        </div>
    );
}

function MessageBar(){

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t">
            <div className="max-w-6xl mx-auto p-4">
                <form className="flex w-full">
                    <input
                        type="text"
                        placeholder="Bir mesaj yazın..."
                        className="flex-grow border-gray-500 border rounded-lg p-2"
                    />
                    <button
                        type="submit"
                        className="w-32 h-12 mx-4 bg-blue-400 text-white font-bold rounded-[50px]"
                    >
                        Gönder
                    </button>
                </form>
            </div>
        </div>
    )
}


export default App

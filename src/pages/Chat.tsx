import autoAnimate from "@formkit/auto-animate";
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "../configs/firebase";

const TopBar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-t-3xl shadow">
      <div className="flex gap-4 items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-700 text-white text-xl">
          GC
        </div>
        <div>
          <h1 className="font-bold text-xl text-gray-600">Group Chat</h1>
          <span className="badge-success text-black text-xs px-2 py-1 rounded-full">
            Online
          </span>
        </div>
      </div>
      <button
        className="btn btn-error"
        onClick={() => {
          auth.signOut();
        }}
      >
        Logout
      </button>
    </div>
  );
};

interface Message {
  id: string;
  message: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isEdited: false;
}

const Message = ({
  message,
  loggedInUserId,
  displayName,
}: {
  message: Message;
  loggedInUserId?: string;
  displayName?: string;
}) => {
  return (
    <div
      className={`max-w-[85%] flex flex-col gap-0.5 ${message.userId === loggedInUserId ? "right-chat" : "left-chat"
        } w-fit rounded-3xl ${message.userId === loggedInUserId ? "bg-blue-600" : "bg-gray-500"
        } text-white px-4 py-2 my-4 ${message.userId == loggedInUserId && "ml-auto text-right"
        }`}
    >
      {message.message}
      <span className="text-xs text-gray-300">
        {message.userId === loggedInUserId ? "You" : displayName}
      </span>
    </div >
  );
};

const TextInput = ({
  handleMessageSend,
}: {
  handleMessageSend: (arg0: string) => void;
}) => {
  const [message, setMessage] = useState("");
  return (
    <form
      className="sticky bg-blue-50 bottom-0 w-full flex items-center py-2 px-4 gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        handleMessageSend(message);
        setMessage("");
      }}
    >
      <input
        placeholder="Type here"
        className="input bg-white w-full"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="text-blue-500 active:scale-125 transition-transform font-bold py-2 px-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      </button>
    </form>
  );
};

const Chat = () => {
  const chatViewRef = useRef<HTMLDivElement>(null);
  const [chats, setChats] = useState<Message[]>([]);
  const [user] = useAuthState(auth);
  console.log(chats);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"), limit(50));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const messages: Message[] = [];
      QuerySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setChats(messages);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (chatViewRef.current) {
      autoAnimate(chatViewRef.current);
      chatViewRef.current.scrollTo({
        top: chatViewRef.current.scrollHeight,
      });
    }
  }, []);

  useEffect(() => {
    setTimeout(
      () =>
        chatViewRef.current?.scrollTo({
          top: chatViewRef.current.scrollHeight,
        }),
      0,
    );
  }, [chats]);

  const handleMessageSend = async (message: string) => {
    if (!user) return;
    if (!message) return;
    await addDoc(collection(db, "messages"), {
      message: message,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isEdited: false,
    });
  };

  return (
    <div className="relative w-full flex flex-col max-w-lg h-screen overflow-hidden mx-auto bg-blue-50">
      <TopBar />
      <div className="relative h-[calc(100vh-160px)] p-4 pr-2 flex items-end">
        <div className="scrollbar pr-1 h-full w-full overflow-y-scroll overflow-x-clip break-words" ref={chatViewRef}>
          {chats.map((message) => (
            <Message message={message} key={message.id} loggedInUserId={user?.uid} displayName={user?.displayName} />
          ))}
        </div>
      </div>
      <TextInput handleMessageSend={handleMessageSend} />
    </div>
  );
};

export default Chat;

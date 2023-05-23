import {
  addDoc,
  collection,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import ConfirmationModal from "../components/ConfirmationModal";
import MessageContainer from "../components/MessageContainer";
import { auth, db } from "../configs/firebase";

const TopBar = () => {
  const [internetStatus, setInternetStatus] = useState<"online" | "offline">("online");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const onLogoutConfirm = async () => {
    auth.signOut();
  };

  useEffect(() => {
    const handleOnline = () => setInternetStatus("online");
    const handleOffline = () => setInternetStatus("offline");
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-white rounded-t-3xl shadow">
        <div className="flex gap-4 items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-700 text-white text-xl">
            GC
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-600">Group Chat</h1>
            <span
              className={`text-black text-xs px-2 py-1 rounded-full ${internetStatus === "online" ? "badge-success" : "badge-error"
                }`}
            >
              {internetStatus?.toUpperCase()}
            </span>
          </div>
        </div>
        <button
          className="btn btn-error"
          onClick={() => {
            setIsLogoutModalOpen(true);
          }}
        >
          Logout
        </button>
      </div>
      <ConfirmationModal
        isModalOpen={isLogoutModalOpen}
        setIsModalOpen={setIsLogoutModalOpen}
        onConfirm={onLogoutConfirm}
        title="Logout"
        description="Are you sure you want to logout?"
        confirmText="Logout"
      />
    </>
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
  const [limit, setLimit] = useState(50);
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"), limitToLast(limit));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const messages: Message[] = [];
      QuerySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setChats(messages);
    });
    return () => unsubscribe();
  }, [limit]);

  useEffect(() => {
    if (chatViewRef.current && chats) {
      chatViewRef.current.scrollTo({
        top: chatViewRef.current.scrollHeight - 30,
      });
    }
  }, [chats, limit]);

  useEffect(() => {
    setTimeout(
      () =>
        chatViewRef.current?.scrollTo({
          top: chatViewRef.current.scrollHeight - 30,
        }),
      0,
    );
  }, [chats]);

  const handleMessageSend = async (message: string) => {
    if (!user) return;
    if (!message) return;
    await addDoc(collection(db, "messages"), {
      message: message,
      user: {
        uid: user.uid,
        displayName: user.displayName,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isEdited: false,
    });
  };

  return (
    <div className="relative w-full flex flex-col max-w-lg h-screen overflow-hidden mx-auto bg-blue-50">
      <TopBar />

      <div
        ref={chatViewRef}
        className="scrollbar relative h-[calc(100vh-150px)] overflow-y-scroll  p-4 pr-2 flex flex-col"
      >
        {chats.length >= limit && (
          // loadmore button
          <div className="flex justify-center items-center p-4">
            <button className="btn btn-primary" onClick={() => setLimit(limit * 2)}>
              Load More
            </button>
          </div>
        )}
        <div className="relative h-full p-4 pr-2 flex items-end">
          <div className=" pr-1 h-full w-full break-words">
            {chats.map((message) => (
              <MessageContainer
                message={message}
                key={message.id}
                loggedInUserId={user?.uid}
              />
            ))}
          </div>
        </div>
      </div>
      <TextInput handleMessageSend={handleMessageSend} />
    </div>
  );
};

export default Chat;

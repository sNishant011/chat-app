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
import TextInput from "../components/TextInput";
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
              className={`text-black text-xs px-2 py-1 rounded-full ${
                internetStatus === "online" ? "badge-success" : "badge-error"
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

const Chat = () => {
  const chatViewRef = useRef<HTMLDivElement>(null);
  const [chats, setChats] = useState<Message[]>([]);
  const [user] = useAuthState(auth);
  const [limit, setLimit] = useState(50);
  const [loadCount, setLoadCount] = useState(0);

  useEffect(() => {
    // for push notification
    Notification.requestPermission().then((permission) => {
      console.log(permission);
    });
  }, []);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"), limitToLast(limit));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const messages: Message[] = [];
      QuerySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setChats(messages);
      if (loadCount <= 1) {
        setLoadCount((prev) => prev + 1);
      }
    });
    return () => unsubscribe();
  }, [limit, loadCount, setLoadCount]);

  // for notification
  useEffect(() => {
    if (loadCount <= 1) return;
    if (chats.length === 0) return;
    const lastMessage = chats[chats.length - 1];
    if (lastMessage.user.uid === user?.uid) return;
    if (lastMessage.isEdited) return;
    if (document.hasFocus()) return;
    const notification = new Notification(lastMessage.user.displayName, {
      body: lastMessage.message,
    });
    notification.onclick = () => {
      window.focus();
    };
  }, [user?.uid, chats, loadCount]);

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

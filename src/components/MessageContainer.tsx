import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";

import { db } from "../configs/firebase";
import MessageDeleteModal from "./MessageDeleteModal";
import MessageEditModal from "./MessageEditModal";

const MessageContainer = ({
  message,
  loggedInUserId,
}: {
  message: Message;
  loggedInUserId?: string;
}) => {
  const [isActive, setIsActive] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleMessageEdit = (newMessage: string) => {
    setIsEditing(true);
    const docRef = doc(db, "messages", message.id);
    updateDoc(docRef, {
      message: newMessage,
      isEdited: true,
      updatedAt: serverTimestamp(),
    }).then(() => {
      setIsEditModalOpen(false);
      setIsEditing(false);
    });
  };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMessageDelete = () => {
    setIsDeleting(true);
    const docRef = doc(db, "messages", message.id);
    deleteDoc(docRef).then(() => {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    });
  };

  return (
    <>
      <div
        className={`flex max-w-[85%] flex-col  my-4   gap-1  w-fit ${message.user.uid === loggedInUserId
            ? "right-chat items-end"
            : "left-chat items-start"
          }  ${message.user.uid == loggedInUserId && "ml-auto text-right"} `}
      >
        <div className="flex gap-1 items-center">
          {isActive && loggedInUserId === message.user.uid && (
            <div className="flex gap-1">
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => setIsEditModalOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
              </button>

              <button
                className="btn btn-xs btn-ghost"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          )}
          <div
            onClick={() => setIsActive(!isActive)}
            className={`flex flex-col gap-0.5 message cursor-pointer w-fit rounded-3xl ${message.user.uid === loggedInUserId ? "bg-blue-600" : "bg-gray-500"
              } text-white px-4 py-2`}
          >
            {message.message}
          </div>
        </div>
        {isActive && (
          <div className="flex gap-2  text-gray-700">
            {message.isEdited && <span className="text-xs">Edited</span>}
            <span className="text-xs">
              {message.user.uid === loggedInUserId ? "You" : message.user.displayName}
            </span>
            <span className="text-xs">
              {new Date(message.createdAt.seconds * 1000).toLocaleString()}
            </span>
          </div>
        )}
      </div>
      <MessageDeleteModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        handleMessageDelete={handleMessageDelete}
        isDeleting={isDeleting}
      />
      <MessageEditModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        handleMessageEdit={handleMessageEdit}
        isEditing={isEditing}
        message={message}
      />
    </>
  );
};

export default MessageContainer;

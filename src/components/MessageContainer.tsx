import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";

import { db } from "../configs/firebase";

const MessageContainer = ({
  message,
  loggedInUserId,
}: {
  message: Message;
  loggedInUserId?: string;
}) => {
  const [newMessage, setNewMessage] = useState(message.message);
  const [isActive, setIsActive] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const handleMessageEdit = () => {
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
      <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-[#a8a8a899] backdrop-blur-md fixed animate-[overlayShow_150ms_cubic-bezier(0.16,1,0.3,1)] inset-0" />
          <Dialog.Content className="bg-[white] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] fixed -translate-x-2/4 -translate-y-2/4 w-[90vw] max-w-[450px] max-h-[85vh] animate-[contentShow_150ms_cubic-bezier(0.16,1,0.3,1)] p-[25px] rounded-md left-2/4 top-2/4">
            <Dialog.Title>Edit Message</Dialog.Title>

            <Dialog.Description className="text-[color:var(--mauve11)] text-[15px] leading-normal mt-2.5 mb-5 mx-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="mt-4"
              >
                <input
                  placeholder="Type here"
                  className="input bg-gray-100 w-full"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className={`btn btn-primary btn-sm px-6 mt-4 float-right ${isEditing && "loading"
                    }`}
                  onClick={handleMessageEdit}
                >
                  Edit
                </button>
              </form>
            </Dialog.Description>
            <Dialog.Close asChild>
              <button
                className="h-[25px] w-[25px] inline-flex items-center justify-center text-[color:var(--violet11)] absolute rounded-[100%] right-2.5 top-2.5 hover:bg-[color:var(--violet4)] focus:shadow-[0_0_0_2px_var(--violet7)]"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <AlertDialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-[#a8a8a899] backdrop-blur-md fixed animate-[overlayShow_150ms_cubic-bezier(0.16,1,0.3,1)] inset-0" />
          <AlertDialog.Content className="bg-[white] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] fixed -translate-x-2/4 -translate-y-2/4 w-[90vw] max-w-[450px] max-h-[85vh] animate-[contentShow_150ms_cubic-bezier(0.16,1,0.3,1)] p-[25px] rounded-md left-2/4 top-2/4">
            <AlertDialog.Title className="font-bold text-lg">
              Are you sure you want to delete?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-gray-600">
              This action cannot be undone. This will permanently deleted from the
              database.
            </AlertDialog.Description>
            <div className="flex justify-between mt-2">
              <AlertDialog.Cancel asChild>
                <button className="btn btn-outline btn-sm">Cancel</button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  className={`btn btn-error text-white btn-sm ${isDeleting && "loading"}`}
                  onClick={handleMessageDelete}
                >
                  Delete Message
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
};

export default MessageContainer;

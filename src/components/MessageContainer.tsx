import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

const MessageContainer = ({
  message,
  loggedInUserId,
}: {
  message: Message;
  loggedInUserId?: string;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleMessageEdit = () => {
    // update message in firebase
    setIsEditModalOpen(false);
  };
  const [newMessage, setNewMessage] = useState(message.message);

  return (
    <>
      <div
        className={`flex max-w-[85%]  my-4   gap-1 items-center w-fit ${message.user.uid === loggedInUserId ? "right-chat" : "left-chat"
          }  ${message.user.uid == loggedInUserId && "ml-auto text-right"} `}
      >
        {loggedInUserId === message.user.uid && (
          <button className="btn btn-xs btn-ghost" onClick={() => setIsEditModalOpen(true)}>
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
        )}
        <div
          className={`flex flex-col gap-0.5 message w-fit rounded-3xl ${message.user.uid === loggedInUserId ? "bg-blue-600" : "bg-gray-500"
            } text-white px-4 py-2`}
        >
          {message.message}
          <span className="text-xs text-gray-300">
            {message.user.uid === loggedInUserId ? "You" : message.user.displayName}
          </span>
        </div>
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
                  className="btn btn-primary btn-sm px-6 mt-4 float-right"
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
    </>
  );
};

export default MessageContainer;

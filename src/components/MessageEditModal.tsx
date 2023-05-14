import * as Dialog from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction, useState } from "react";

type messageEditModalProps = {
  isEditModalOpen: boolean;
  setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
  message: Message;
  isEditing: boolean;
  handleMessageEdit: (arg0: string) => void;
};

const MessageEditModal = ({
  isEditModalOpen,
  handleMessageEdit,
  setIsEditModalOpen,
  isEditing,
  message,
}: messageEditModalProps) => {
  const [newMessage, setNewMessage] = useState(message.message);
  return (
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
                onClick={() => handleMessageEdit(newMessage)}
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
  );
};

export default MessageEditModal;

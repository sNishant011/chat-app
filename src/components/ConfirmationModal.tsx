import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Dispatch, SetStateAction } from "react";

type deleteModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
};

const ConfirmationModal = ({
  isModalOpen,
  setIsModalOpen,
  onConfirm,
  title,
  description,
  confirmText,
}: deleteModalProps) => {
  return (
    <AlertDialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-[#a8a8a899] backdrop-blur-md fixed animate-[overlayShow_150ms_cubic-bezier(0.16,1,0.3,1)] inset-0" />
        <AlertDialog.Content className="bg-[white] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] fixed -translate-x-2/4 -translate-y-2/4 w-[90vw] max-w-sm max-h-[85vh] animate-[contentShow_150ms_cubic-bezier(0.16,1,0.3,1)] p-[25px] rounded-md left-2/4 top-2/4">
          <AlertDialog.Title className="font-bold text-lg">{title}</AlertDialog.Title>
          <AlertDialog.Description className="text-gray-600">
            {description}
          </AlertDialog.Description>
          <div className="flex justify-between mt-2">
            <AlertDialog.Cancel asChild>
              <button className="btn btn-outline btn-sm">Cancel</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button className={`btn btn-error text-white btn-sm`} onClick={onConfirm}>
                {confirmText || "Confirm"}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default ConfirmationModal;

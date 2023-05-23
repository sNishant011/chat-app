import { useState } from "react";

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
export default TextInput;

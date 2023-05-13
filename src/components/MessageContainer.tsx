const MessageContainer = ({
  message,
  loggedInUserId,
}: {
  message: Message;
  loggedInUserId?: string;
}) => {
  return (
    <div
      className={`flex max-w-[85%]  my-4   gap-1 items-center w-fit ${message.user.uid === loggedInUserId ? "right-chat" : "left-chat"
        }  ${message.user.uid == loggedInUserId && "ml-auto text-right"} `}
    >
      {loggedInUserId === message.user.uid && (
        <button className="btn btn-xs btn-ghost">
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
  );
};

export default MessageContainer;

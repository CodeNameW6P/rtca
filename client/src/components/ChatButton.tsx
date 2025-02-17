type ChatButtonType = {
    name: string;
    id: string;
    isGroupChat?: boolean;
    lastMessage?: string;
    createdAt?: string;
    handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const ChatButton: React.FC<ChatButtonType> = ({ name, id, isGroupChat, lastMessage, createdAt, handleClick }) => {
    const personSVG = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            // width="16"
            // height="16"
            // fill="currentColor"
            // class="bi bi-person"
            className="size-8"
            viewBox="0 0 16 16"
        >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
        </svg>
    );

    const peopleSVG = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            // width="16"
            // height="16"
            // fill="currentColor"
            // class="bi bi-people"
            className="size-8"
            viewBox="0 0 16 16"
        >
            <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
        </svg>
    );

    return (
        <>
            <button
                onClick={handleClick}
                className="flex flex-row bg-white py-3 px-4 mx-3 rounded-md gap-4 items-center mb-3"
                id={id}
            >
                <div className="bg-slate-100 rounded-full p-2">{isGroupChat ? peopleSVG : personSVG}</div>
                <div className="flex flex-col items-start justify-center w-full">
                    <span className="truncate">{name}</span>
                    <div className="flex flex-row justify-between w-full items-baseline">
                        <span className="">
                            {lastMessage && lastMessage?.slice(0, 30)}
                            {lastMessage && lastMessage.length > 30 && "..."}
                        </span>
                        <span className="text-xs">{createdAt}</span>
                    </div>
                </div>
            </button>
        </>
    );
};

export default ChatButton;

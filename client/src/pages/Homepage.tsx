import { useEffect, useState } from "react";
import { api, extractError } from "../config/axiosConfig";
import { useAppSelector, useAppDispatch } from "../config/redux/hooks";
import { signOut } from "../config/redux/slices/userSlice";
import { addMessage, setChats, setCurrentChat, setMessages } from "../config/redux/slices/chatSlice";

const Homepage: React.FC = () => {
    const _id = useAppSelector((state) => state.user._id);
    const socket = useAppSelector((state) => state.user.socket);

    const chats = useAppSelector((state) => state.chat.chats);
    const currentChat = useAppSelector((state) => state.chat.currentChat);
    const messages = useAppSelector((state) => state.chat.messages)
        .slice()
        .reverse();

    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState({
        chats: false,
        messages: false,
        users: false,
        sending: false,
    });

    const [text, setText] = useState("");
    const [search, setSearch] = useState("");

    const [isOpen, setIsOpen] = useState({
        settings: false,
        profile: false,
        search: false,
    });

    const [searchedUsers, setSearchedUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState<any>([]);

    // useEffect(() => {
    //     const initiateMessageSocket = () => {
    //         if (socket) {
    //             socket.on("newMessage", (newMessage: any) => {
    //                 if (currentChat === newMessage.chat) {
    //                     dispatch(addMessage(newMessage));
    //                 }
    //             });
    //         }
    //     };

    //     initiateMessageSocket();
    //     return () => {
    //         if (socket) socket.off("newMessage");
    //     };
    // }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading((prev) => ({
                ...prev,
                messages: true,
            }));
            try {
                const res = await api.get(`/message/${currentChat._id}`);
                dispatch(setMessages(res.data));
            } catch (error) {
                console.error(extractError(error));
            }
            setIsLoading((prev) => ({
                ...prev,
                messages: false,
            }));
        };

        if (currentChat) {
            fetchMessages();
        }
    }, [currentChat]);

    useEffect(() => {
        const fetchChats = async () => {
            setIsLoading((prev) => ({
                ...prev,
                chats: true,
            }));
            try {
                const res = await api.get(`/chat/${_id}`);
                dispatch(setChats(res.data));
                dispatch(setCurrentChat(res.data[0]));
            } catch (error) {
                console.error(extractError(error));
            }
            setIsLoading((prev) => ({
                ...prev,
                chats: false,
            }));
        };

        fetchChats();
    }, []);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await api.get(`/chat/${_id}`);
                dispatch(setChats(res.data));
            } catch (error) {
                console.error(extractError(error));
            }
        };

        fetchChats();
    }, [messages]);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading((prev) => ({
                ...prev,
                users: true,
            }));
            try {
                const res = await api.get(`/search?query=${search}`);
                setSearchedUsers((prev) => (prev = res.data));
            } catch (error) {
                console.error(extractError(error));
            }
            setIsLoading((prev) => ({
                ...prev,
                users: false,
            }));
        };

        fetchUsers();
    }, [search]);

    const handleSendMessage = async () => {
        setIsLoading((prev) => ({
            ...prev,
            sending: true,
        }));
        try {
            const trimmedText = text.trim();
            if (!trimmedText || trimmedText === "" || trimmedText === null) {
                return;
            }
            const res = await api.post(`/message/${currentChat._id}`, { text: trimmedText });
            if (res) {
                dispatch(addMessage(res.data));
            }
            setText((prev) => (prev = ""));
        } catch (error) {
            console.error(extractError(error));
        }
        setIsLoading((prev) => ({
            ...prev,
            sending: false,
        }));
    };

    const handleCreateDM = async () => {
        try {
            if (selectedUsers.length > 1) {
                const res = await api.post(`/chat`, { name: "", isGroupChat: false });
            }
        } catch (error) {}
    };

    const handleSignOut = async () => {
        try {
            const res = await api.get("/auth/signout");
            socket.disconnect();
            dispatch(signOut());
            console.log(res.data.message);
        } catch (error) {
            console.error(extractError(error));
        }
    };

    const personSVG = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            // width="16"
            // height="16"
            // fill="currentColor"
            // class="bi bi-person"
            className=""
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
            className=""
            viewBox="0 0 16 16"
        >
            <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
        </svg>
    );

    const CDSpinner = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            // width="16"
            // height="16"
            // fill="currentColor"
            // class="bi bi-disc"
            className="w-[160px] animate-spin fill-slate-300"
            viewBox="0 0 16 16"
        >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0M8 4a4 4 0 0 0-4 4 .5.5 0 0 1-1 0 5 5 0 0 1 5-5 .5.5 0 0 1 0 1m4.5 3.5a.5.5 0 0 1 .5.5 5 5 0 0 1-5 5 .5.5 0 0 1 0-1 4 4 0 0 0 4-4 .5.5 0 0 1 .5-.5" />
        </svg>
    );

    return (
        <>
            <div className="flex h-screen bg-gradient-to-br from-violet-950 to-slate-950 justify-center items-center">
                {isOpen.settings && (
                    <div className="fixed flex inset-0 justify-center items-center bg-black bg-opacity-50">
                        <div className="flex flex-col bg-white rounded-md p-6 gap-4">
                            <span>Nothing to set here!</span>
                            <button
                                onClick={() => {
                                    setIsOpen((prev) => ({
                                        ...prev,
                                        settings: false,
                                    }));
                                }}
                                type="button"
                                className="bg-violet-950 font-semibold py-2 px-4 text-white rounded-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex flex-row w-[70%] h-[80%] min-h-[700px] gap-4 min-w-[1300px]">
                    <div className="flex flex-col bg-slate-100 rounded-md min-w-[540px]">
                        <div className="flex flex-row gap-4 mt-8 items-center mx-6">
                            <div className="bg-slate-300 p-4 rounded-md">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    // width="16"
                                    // height="16"
                                    // fill="currentColor"
                                    // class="bi bi-chat-left"
                                    className="size-10"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-semibold grow">Chats</h1>
                        </div>
                        <input
                            className="focus:outline-none py-2 px-4 rounded-md my-8 mx-6"
                            type="search"
                            name="searchUser"
                            id="searchUser"
                            placeholder="Search"
                            value={search}
                            onFocus={() => {
                                setIsOpen((prev) => ({
                                    ...prev,
                                    search: true,
                                }));
                            }}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setSearch((prev) => (prev = event.target.value));
                            }}
                        />
                        {isLoading.chats || isLoading.users ? (
                            <div className="flex justify-center items-center grow mb-[32px]">{CDSpinner}</div>
                        ) : isOpen.search ? (
                            <div className="flex flex-col grow overflow-y-scroll">
                                <div className="flex flex-row gap-2 mb-3 mx-3">
                                    {selectedUsers &&
                                        selectedUsers.length !== 0 &&
                                        selectedUsers.map((su: any) => (
                                            <div
                                                className="flex flex-row gap-2 py-1 px-3 bg-slate-300 rounded-md"
                                                key={su._id}
                                            >
                                                <span>{su.username}</span>
                                                <button
                                                    onClick={() => {
                                                        setSelectedUsers(
                                                            selectedUsers.filter((fu: any) => fu._id !== su._id)
                                                        );
                                                    }}
                                                >
                                                    &#10005;
                                                </button>
                                            </div>
                                        ))}
                                    {selectedUsers && selectedUsers.length > 0 && (
                                        <button
                                            onClick={handleCreateDM}
                                            className="bg-violet-950 text-white font-semibold py-1 px-3 rounded-md"
                                        >
                                            Create DM
                                        </button>
                                    )}
                                </div>
                                {searchedUsers.map((user: any, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (!selectedUsers.some((su: any) => su._id === user._id)) {
                                                setSelectedUsers([...selectedUsers, user]);
                                            }
                                        }}
                                        className="flex flex-row bg-white py-3 px-4 mx-3 rounded-md gap-4 items-center mb-3"
                                        id={user._id}
                                    >
                                        <div className="bg-slate-100 rounded-full p-2 w-14">{personSVG}</div>
                                        <div className="flex flex-col items-start justify-center w-full">
                                            <span className="truncate">{user.username}</span>
                                            <span className="truncate">{user._id}</span>
                                        </div>
                                    </button>
                                ))}
                                <button
                                    onClick={() => {
                                        setSearch((prev) => (prev = ""));
                                        setSelectedUsers([]);
                                        setIsOpen((prev) => ({
                                            ...prev,
                                            search: false,
                                        }));
                                    }}
                                    className="py-2 px-6 bg-violet-950 text-white rounded-md font-semibold mx-3 mb-3 w-min"
                                    type="button"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col grow overflow-y-scroll">
                                {chats.map((chat: any, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            dispatch(setCurrentChat(chat));
                                        }}
                                        className="flex flex-row bg-white py-3 px-4 mx-3 rounded-md gap-4 items-center mb-3"
                                        id={chat._id}
                                        type="button"
                                    >
                                        <div className="bg-slate-100 rounded-full p-2 w-14">
                                            {chat.isGroupChat ? peopleSVG : personSVG}
                                        </div>
                                        <div className="flex flex-col items-start justify-center w-full">
                                            <span className={`truncate ${currentChat._id === chat._id && "underline"}`}>
                                                {chat.isGroupChat
                                                    ? chat.name
                                                    : chat.users[0]?._id === _id
                                                    ? chat.users[1]?.username
                                                    : chat.users[0]?.username}
                                            </span>
                                            <div className="flex flex-row justify-between w-full items-baseline">
                                                <span className="">
                                                    {chat.lastMessage?.text?.slice(0, 30)}
                                                    {chat.lastMessage?.text?.length > 30 && "..."}
                                                </span>
                                                <span className="text-xs">{chat.createdAt}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="flex bg-slate-300 p-3 gap-3 rounded-b-md">
                            <button className="bg-white size-10 rounded-full p-2" type="button">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    // width="16"
                                    // height="16"
                                    // fill="currentColor"
                                    // class="bi bi-person-wheelchair"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M12 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-.663 2.146a1.5 1.5 0 0 0-.47-2.115l-2.5-1.508a1.5 1.5 0 0 0-1.676.086l-2.329 1.75a.866.866 0 0 0 1.051 1.375L7.361 3.37l.922.71-2.038 2.445A4.73 4.73 0 0 0 2.628 7.67l1.064 1.065a3.25 3.25 0 0 1 4.574 4.574l1.064 1.063a4.73 4.73 0 0 0 1.09-3.998l1.043-.292-.187 2.991a.872.872 0 1 0 1.741.098l.206-4.121A1 1 0 0 0 12.224 8h-2.79zM3.023 9.48a3.25 3.25 0 0 0 4.496 4.496l1.077 1.077a4.75 4.75 0 0 1-6.65-6.65z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => {
                                    setIsOpen((prev) => ({
                                        ...prev,
                                        settings: true,
                                    }));
                                }}
                                className="bg-white size-10 rounded-full p-2"
                                type="button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    // width="16"
                                    // height="16"
                                    // fill="currentColor"
                                    // class="bi bi-gear-wide-connected"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z" />
                                </svg>
                            </button>
                            <button onClick={handleSignOut} className="bg-white size-10 rounded-full p-2" type="button">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    // width="16"
                                    // height="16"
                                    // fill="currentColor"
                                    // class="bi bi-power"
                                    className=""
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M7.5 1v7h1V1z" />
                                    <path d="M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col bg-slate-100 w-[70%] rounded-md">
                        <div className="flex flex-row bg-slate-300 rounded-t-md p-3 gap-3 items-center">
                            <div className="bg-white size-10 p-2 rounded-full">
                                {currentChat?.isGroupChat ? peopleSVG : personSVG}
                            </div>
                            <span className="font-semibold">
                                {currentChat?.isGroupChat
                                    ? currentChat?.name
                                    : currentChat?.users[0]?._id === _id
                                    ? currentChat?.users[1]?.username
                                    : currentChat?.users[0]?.username}
                            </span>
                        </div>
                        {isLoading.messages ? (
                            <div className="flex grow justify-center items-center">{CDSpinner}</div>
                        ) : (
                            <div className="flex flex-col-reverse grow overflow-y-scroll">
                                {messages &&
                                    messages.map((message: any, index) => (
                                        <div key={index} className="flex flex-row gap-3 items-center mx-3 mb-3">
                                            <div className="bg-white size-10 rounded-full p-2">{personSVG}</div>
                                            <div className="flex flex-col">
                                                <div className="text-xs">{message.sender.username}</div>
                                                <div className="bg-slate-300 px-3 py-1 rounded-md">{message.text}</div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                        <div className="flex flex-row gap-3 bg-slate-300 rounded-b-md p-3">
                            <button className="bg-white min-w-10 p-2 rounded-full" type="button">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    // width="16"
                                    // height="16"
                                    // fill="currentColor"
                                    // class="bi bi-file-earmark-plus"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5" />
                                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z" />
                                </svg>
                            </button>
                            <button className="bg-white min-w-10 p-2 rounded-full" type="button">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    // width="16"
                                    // height="16"
                                    // fill="currentColor"
                                    // class="bi bi-emoji-angry"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683m6.991-8.38a.5.5 0 1 1 .448.894l-1.009.504c.176.27.285.64.285 1.049 0 .828-.448 1.5-1 1.5s-1-.672-1-1.5c0-.247.04-.48.11-.686a.502.502 0 0 1 .166-.761zm-6.552 0a.5.5 0 0 0-.448.894l1.009.504A1.94 1.94 0 0 0 5 6.5C5 7.328 5.448 8 6 8s1-.672 1-1.5c0-.247-.04-.48-.11-.686a.502.502 0 0 0-.166-.761z" />
                                </svg>
                            </button>
                            <input
                                className="focus:outline-none py-2 px-4 rounded-md w-full"
                                type="text"
                                name="message"
                                id="message"
                                placeholder="Message"
                                value={text}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setText((prev) => (prev = event.target.value));
                                }}
                            />
                            <button
                                disabled={isLoading.sending || text.trim().length === 0}
                                onClick={handleSendMessage}
                                className="py-2 px-4 bg-violet-950 text-white rounded-md font-semibold disabled:cursor-not-allowed"
                            >
                                {isLoading.sending ? "Sending..." : "Send"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Homepage;

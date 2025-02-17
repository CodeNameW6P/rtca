import { useEffect, useState } from "react";
import { api, extractError } from "../config/axiosConfig";
import { useAppSelector, useAppDispatch } from "../config/redux/hooks";
import { signOut } from "../config/redux/slices/userSlice";
import { addMessage, setChats, setCurrentChat, setMessages } from "../config/redux/slices/chatSlice";
import ChatButton from "../components/ChatButton";
import MessageBubble from "../components/MessageBubble";
import { setIsSearching, setSearch, setUsers } from "../config/redux/slices/searchSlice";
import UserButton from "../components/UserButton";

const Homepage: React.FC = () => {
    const _id = useAppSelector((state) => state.user._id);

    const chats = useAppSelector((state) => state.chat.chats);
    const currentChat = useAppSelector((state) => state.chat.currentChat);
    const messages = useAppSelector((state) => state.chat.messages);

    const isSearching = useAppSelector((state) => state.search.isSearching);
    const search = useAppSelector((state) => state.search.search);
    const users = useAppSelector((state) => state.search.users);

    const dispatch = useAppDispatch();

    const [isFetching, setIsFetching] = useState({
        chats: false,
        messages: false,
        users: false,
    });

    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            setIsFetching((prev) => ({
                ...prev,
                messages: true,
            }));
            try {
                const res = await api.get(`/message/${currentChat}`);
                dispatch(setMessages(res.data));
            } catch (error) {
                console.error(extractError(error));
            }
            setIsFetching((prev) => ({
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
            setIsFetching((prev) => ({
                ...prev,
                chats: true,
            }));
            try {
                const res = await api.get(`/chat/${_id}`);
                dispatch(setChats(res.data));
                dispatch(setCurrentChat(res.data[0]?._id));
            } catch (error) {
                console.error(extractError(error));
            }
            setIsFetching((prev) => ({
                ...prev,
                chats: false,
            }));
        };

        fetchChats();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!search || search === "") {
                dispatch(setUsers([]));
                return;
            }
            setIsFetching((prev) => ({
                ...prev,
                users: true,
            }));
            try {
                const res = await api.get(`/search?query=${search}`);
                dispatch(setUsers(res.data));
            } catch (error) {
                console.error(extractError(error));
            }
            setIsFetching((prev) => ({
                ...prev,
                users: false,
            }));
        };

        fetchUsers();
    }, [search]);

    const handleChatButton = async (event: React.MouseEvent<HTMLButtonElement>) => {
        dispatch(setCurrentChat(event.currentTarget.id));
    };

    const [text, setText] = useState("");

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText((prev) => (prev = event.target.value));
    };

    const handleSendMessage = async () => {
        setIsSending((prev) => (prev = true));
        try {
            const res = await api.post(`/message/${currentChat}`, { text: text.trim() });
            if (res) {
                dispatch(addMessage(res.data));
            }
        } catch (error) {
            console.error(extractError(error));
        }
        setIsSending((prev) => (prev = false));
    };

    const handleChatInitiate = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const res = await api.post(`/chat`, {
                name: "",
                isGroupChat: false,
                users: [_id, event.currentTarget.id],
                groupAdmin: null,
            });
            dispatch(setCurrentChat(res.data._id));
        } catch (error) {
            console.error(extractError(error));
        }
    };

    const handleSignOut = async () => {
        try {
            const res = await api.get("/auth/signout");
            dispatch(signOut());
            console.log(res.data.message);
        } catch (error) {
            console.error(extractError(error));
        }
    };

    return (
        <>
            <div className="flex h-screen bg-gradient-to-br from-violet-950 to-slate-950 justify-center items-center">
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
                            <h1 className="text-4xl font-semibold">Chats</h1>
                        </div>
                        <input
                            className="focus:outline-none py-2 px-4 rounded-md my-8 mx-6"
                            type="search"
                            name="searchUser"
                            id="searchUser"
                            placeholder="Search"
                            value={search}
                            onFocus={() => {
                                dispatch(setIsSearching(true));
                            }}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(setSearch(event.target.value));
                            }}
                        />
                        {isFetching.chats || isFetching.users ? (
                            <div className="flex justify-center items-center grow mb-[32px]">
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
                            </div>
                        ) : isSearching ? (
                            <div className="flex flex-col grow overflow-y-scroll">
                                {users.map((user: any, index) => (
                                    <UserButton
                                        key={index}
                                        name={user.username}
                                        id={user._id}
                                        handleClick={handleChatInitiate}
                                    />
                                ))}
                                <button
                                    onClick={() => {
                                        dispatch(setSearch(""));
                                        dispatch(setIsSearching(false));
                                    }}
                                    className="p-2 bg-violet-950 text-white rounded-md font-semibold mx-3 mb-3 w-min"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col grow overflow-y-scroll">
                                {chats.map((chat: any, index) => (
                                    <ChatButton
                                        key={index}
                                        name={chat.name}
                                        id={chat._id}
                                        isGroupChat={chat.isGroupChat}
                                        lastMessage={chat.lastMessage?.text}
                                        createdAt={chat.lastMessage?.createdAt}
                                        handleClick={handleChatButton}
                                    />
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
                            <button className="bg-white size-10 rounded-full p-2" type="button">
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
                        <div className="flex flex-row bg-slate-300 rounded-t-md p-3">
                            <div className="bg-white size-10 p-2 rounded-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    // width="16"
                                    // height="16"
                                    // fill="currentColor"
                                    // class="bi bi-yin-yang"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M9.167 4.5a1.167 1.167 0 1 1-2.334 0 1.167 1.167 0 0 1 2.334 0" />
                                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1 8a7 7 0 0 1 7-7 3.5 3.5 0 1 1 0 7 3.5 3.5 0 1 0 0 7 7 7 0 0 1-7-7m7 4.667a1.167 1.167 0 1 1 0-2.334 1.167 1.167 0 0 1 0 2.334" />
                                </svg>
                            </div>
                        </div>
                        {isFetching.messages ? (
                            <div className="flex grow justify-center items-center">
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
                            </div>
                        ) : (
                            <div className="flex flex-col justify-end grow overflow-y-scroll">
                                {messages.map((message: any, index) => (
                                    <MessageBubble
                                        key={index}
                                        id={message._id}
                                        chat={message.chat}
                                        text={message.text}
                                        sender={message.sender}
                                        createdAt={message.createdAt}
                                        updatedAt={message.updatedAt}
                                    />
                                ))}
                            </div>
                        )}
                        <div className="flex flex-row gap-3 bg-slate-300 rounded-b-md p-3">
                            <button className="bg-white min-w-10 p-2 rounded-full">
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
                            <button className="bg-white min-w-10 p-2 rounded-full">
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
                                // type="text"
                                name="message"
                                id="message"
                                placeholder="Message"
                                value={text}
                                onChange={handleTextChange}
                            />
                            <button
                                disabled={isSending || text.trim().length === 0}
                                onClick={handleSendMessage}
                                className="p-2 bg-violet-950 text-white rounded-md font-semibold disabled:cursor-not-allowed"
                            >
                                {isSending ? "Sending..." : "Send"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Homepage;

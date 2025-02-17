import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ChatStateType = {
    chats: any[];
    currentChat: string | null;
    messages: any[];
};

const initialState: ChatStateType = {
    chats: [],
    currentChat: null,
    messages: [],
};

const chatSlice = createSlice({
    name: "chatSlice",
    initialState,
    reducers: {
        setChats: (state, action: PayloadAction<[]>) => {
            state.chats = action.payload;
        },
        setCurrentChat: (state, action: PayloadAction<string>) => {
            state.currentChat = action.payload;
        },
        setMessages: (state, action: PayloadAction<any[]>) => {
            state.messages = action.payload;
        },
        addMessage: (state, action: PayloadAction<any>) => {
            state.messages = [...state.messages, action.payload];
        },
    },
});

export const { setChats, setCurrentChat, setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;

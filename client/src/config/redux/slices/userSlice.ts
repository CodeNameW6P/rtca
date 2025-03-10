import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type UserStateType = {
    isAuthenticated: boolean;
    _id: string | null;
    username: string | null;
    email: string | null;
    profilePicture: string | null;
    createdAt: string | null;
    socket: any;
};

const initialState: UserStateType = {
    isAuthenticated: false,
    _id: null,
    username: null,
    email: null,
    profilePicture: null,
    createdAt: null,
    socket: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signIn: (state, action: PayloadAction<any>) => {
            state.isAuthenticated = true;
            state._id = action.payload._id;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.profilePicture = action.payload.profilePicture;
            state.createdAt = action.payload.createdAt;
            state.socket = action.payload.socket;
        },
        signOut: (state) => {
            state.isAuthenticated = false;
            state._id = null;
            state.username = null;
            state.email = null;
            state.profilePicture = null;
            state.createdAt = null;
            state.socket = null;
        },
    },
});

export const { signIn, signOut } = userSlice.actions;
export default userSlice.reducer;

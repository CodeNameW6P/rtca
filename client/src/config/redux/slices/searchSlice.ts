import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type SearchStateType = {
    isSearching: boolean;
    search: string;
    users: any[];
};

const initialState: SearchStateType = {
    isSearching: false,
    search: "",
    users: [],
};

const searchSlice = createSlice({
    name: "searchSlice",
    initialState,
    reducers: {
        setIsSearching: (state, action: PayloadAction<boolean>) => {
            state.isSearching = action.payload;
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        setUsers: (state, action: PayloadAction<any[]>) => {
            state.users = action.payload;
        },
    },
});

export const { setIsSearching, setSearch, setUsers } = searchSlice.actions;
export default searchSlice.reducer;

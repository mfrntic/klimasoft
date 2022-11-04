import { createSlice } from "@reduxjs/toolkit";

const initialState = {

};

export const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {

    }
});

export const projectActions = projectSlice.actions;
export default projectSlice.reducer;
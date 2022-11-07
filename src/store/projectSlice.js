import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    header: {
        projectName: undefined,
        period: {
            from: undefined,
            to: undefined
        },
        station: {
            IDStation: undefined,
            StationName: undefined,
            Altitude: undefined,
            Latitude: undefined,
            Longitude: undefined,
            IDStationType: undefined,
            StationTypeName: undefined
        },
        description: undefined
    },
    data: {
        meanTemp: [],
        avgMaxTemp: [],
        avgMinTemp: [],
        absMaxTemp: [],
        absMinTemp: [],
        percipitation: []
    }
}

export const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        reset: function(state){
            state = initialState;
        },
        setHeader: function (state, action) {
            console.log("setHeader", action);
            state.header = action.payload;
        },
        setData: function (state, action) {
            // const { measureID, data } = action.payload;
            state.data = { ...state.data, ...action.payload };
        }
    }
});

export const projectActions = projectSlice.actions;
export default projectSlice.reducer;
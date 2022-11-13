import { createSlice, current } from "@reduxjs/toolkit";

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
        reset: function (state) {
            state.header = initialState.header;
            state.data = initialState.data;
        },
        setHeader: function (state, action) {
            // console.log("setHeader", action);
            state.header = action.payload;
        },
        setData: function (state, action) {
            // const { measureID, data } = action.payload;
            //state.data = { ...state.data, ...action.payload };
            //    const data = { ...state.data, ...action.payload };
            const data = action.payload;

            for (const prop in data) {
                console.log("data[prop]", prop, data[prop]);
                state.data[prop] = data[prop].map(row => {
                    // console.log("row", row);
                    row = row.map((val, i) => {
                        if (i > 0) {
                            try {
                                const tmp = parseFloat(val.toString().replace(",", "."));
                                if (!isNaN(tmp)) {
                                    val = tmp;
                                }
                            }
                            catch { }
                        }
                        return val;
                    });
                    return row; //.filter(a => a !== "" && !isNaN(a));
                });
            }
            // console.log("data,", data);
            // state.data = data;

        }
    }
});

export const projectActions = projectSlice.actions;
export default projectSlice.reducer;
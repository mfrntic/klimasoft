import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
    allItems: [],
    searchTerm: "",
    loading: false
}

export const stationSlice = createSlice({
    name: "stations",
    initialState,
    reducers: {
        init: (state, action) => {
            //  console.log("setData", action);
            state.loading = true;
            state.allItems = action.payload;
            state.items = [...action.payload];
            state.loading = false;
        },
        search: (state, action) => {
            state.loading = true;
            const term = action.payload;
            // console.log("term", term, current(state).allItems);
            const filtered = state.allItems.filter(a => a.StationName.toLowerCase().includes(term.toLowerCase()));
            //console.log(filtered);
            state.searchTerm = action.payload;
            state.items = filtered;
            state.loading = false;
        },
        add: (state, action) => {
            const station = action.payload;
            function replacer(a) {
                if (a.IDStation.toString() === station.IDStation) {
                    return station;
                }
                else {
                    return a;
                }
            }

            if (station.isNew) {
                delete station.isNew;
                state.allItems.push(station);
                if (state.items.findIndex(a=>a.IDStation === station.IDStation) > -1){
                    state.items.push(station);
                }
            }
            else {
                delete station.isNew;
                state.allItems = state.allItems.map(replacer);
                state.items = state.items.map(replacer);
            }
        },
        remove: (state, action) => {
            const station = action.payload;
            state.allItems = state.allItems.filter(a=>a.IDStation !== station.IDStation);
            state.items = state.items.filter(a=>a.IDStation !== station.IDStation);
            
        }
    }
});

export const stationsActions = stationSlice.actions;
export default stationSlice.reducer;
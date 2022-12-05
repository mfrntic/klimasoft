import { createSlice } from "@reduxjs/toolkit";
import { getCalculations } from "../lib/calculations";

const initialState = {
  header: {
    projectName: undefined,
    period: {
      from: undefined,
      to: undefined,
    },
    station: {
      IDStation: undefined,
      StationName: undefined,
      Altitude: undefined,
      Latitude: undefined,
      Longitude: undefined,
      IDStationType: undefined,
      StationTypeName: undefined,
    },
    description: undefined,
  },
  data: {
    meanTemp: [],
    avgMaxTemp: [],
    avgMinTemp: [],
    absMaxTemp: [],
    absMinTemp: [],
    percipitation: [],
  },
  calculations: getCalculations(),
};

console.log("initState", initialState);

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    reset: function (state) {
      state.header = initialState.header;
      state.data = initialState.data;
      state.calculations = getCalculations()
    },
    setCalculations: function (state, action) {
      // console.log("setCalculations", action.payload);
      if (!!action && Array.isArray(action) && action.length > 0) {
        state.calculations = action.payload;
      }
      else {
        state.calculations =  getCalculations();
      }
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
        // console.log("data[prop]", prop, data[prop]);
        state.data[prop] = data[prop].map((row) => {
          // console.log("row", row);
          row = row.map((val, i) => {
            if (i > 0) {
              try {
                const tmp = parseFloat(val.toString().replace(",", "."));
                if (!isNaN(tmp)) {
                  val = tmp;
                }
              } catch { }
            }
            return val;
          });
          return row; //.filter(a => a !== "" && !isNaN(a));
        });
      }
      // console.log("data,", data);
      // state.data = data;
    },
    calculationSelect: function (state, action) {
      const { functionName, selected } = action.payload;
      const calc = state.calculations.find((a) => a.name == functionName);
      calc.selected = selected;
    },
    calculationParameter: function (state, action) {
      const { functionName, parameter, value } = action.payload;
      const calc = state.calculations.find((a) => a.name === functionName);
      const param = calc.parameters.find((a) => a.parameter === parameter);
      param.value = value;
    },
  },
});

export const projectActions = projectSlice.actions;
export default projectSlice.reducer;

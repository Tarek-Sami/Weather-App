import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchWeather = createAsyncThunk(
  "weatherApi/fetchWeather",

  async ({ search, lat, lon }) => {
    // const [cities, setCities] = useState([]);
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`,
    );

    const responseTemp = Math.round(response.data.main.temp - 273.15);
    const responseDiscrertion = response.data.weather[0].description;
    const responseMin = Math.round(response.data.main.temp_min - 273.15);
    const responseMax = Math.round(response.data.main.temp_max - 273.15);
    const responseIcon = response.data.weather[0].icon;

    // if (!search || search.trim() === "") {
    //   setCities([]);
    //   return;
    // }
    return {
      currentTemp: responseTemp,
      description: responseDiscrertion,
      min: responseMin,
      max: responseMax,
      icon: responseIcon,
    };
  },
);

export const fetchCities = createAsyncThunk(
  "weatherApi/fetchCities",
  async (search) => {
    let cities = [];

    if (search && search.trim() !== "") {
      const searhResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=10&appid=${process.env.REACT_APP_WEATHER_API_KEY}`,
      );
      cities = searhResponse.data;
    }

    return cities;
  },
);

const weatherApiSlice = createSlice({
  name: "weatherApi",
  initialState: {
    result: "empty",
    weather: {},
    cities: [],
    isLoading: false,
  },
  reducers: {
    changeResult(state, action) {
      state.result = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.isLoading = false;
        state.result = "succeeded";
        state.weather = action.payload;
        state.cities = action.payload.cities;

        console.log(state.weather);
        console.log(state.cities);
      })
      .addCase(fetchWeather.rejected, (state) => {
        state.isLoading = true;
        state.result = "failed";
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.cities = action.payload;
      });
  },
});

export const { changeResult } = weatherApiSlice.actions;
export default weatherApiSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPizzas = createAsyncThunk(
  "pizza/fetchPizzasStatus",
  async (params, thunkAPI) => {
    const { sortBy, order, category, search, currentPage } = params;
    const { data } = await axios.get(
      `https://632d38db0d7928c7d246d6e6.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
    );

    return data;
  }
);

const initialState = {
  items: [],
  status: "loading",
};

export const pizzaSlice = createSlice({
  name: "pizza",
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPizzas.pending, (state) => {
        state.status = "loading";
        state.items = [];
      })
      .addCase(fetchPizzas.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "success";
      })
      .addCase(fetchPizzas.rejected, (state) => {
        state.status = "error";
        state.items = [];
      });
  },
});
export const selectPizzaData = (state) => state.pizza;
export const { setItems } = pizzaSlice.actions;

export default pizzaSlice.reducer;

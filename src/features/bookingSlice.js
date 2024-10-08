import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

export const submitBooking = createAsyncThunk(
  'booking/submitBooking',
  async (_, { getState }) => {
    const { bookingData } = getState().booking;
    const docRef = await addDoc(collection(db, 'bookings'), bookingData);
    return { ...bookingData, id: docRef.id };
  }
);

const initialState = {
  bookings: [],
  bookingData: {
    name: '',
    date: '',
    time: '',
    email: '',
    phone: '',
    description: '',
  },
  currentEditingId: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    updateBookingField(state, action) {
      const { field, value } = action.payload;
      state.bookingData[field] = value;
    },
    addBooking(state, action) {
      state.bookings.push({ ...action.payload, id: Date.now() });
      state.bookingData = initialState.bookingData;
      state.currentEditingId = null;
    },
    setEditingBooking(state, action) {
      const bookingToEdit = state.bookings.find(
        (booking) => booking.id === action.payload
      );
      if (bookingToEdit) {
        state.bookingData = { ...bookingToEdit };
        state.currentEditingId = action.payload;
      }
    },
    resetBookingForm(state) {
      state.bookingData = initialState.bookingData;
    },
    deleteBooking(state, action) {
      state.bookings = state.bookings.filter(
        (booking) => booking.id !== action.payload
      );
      if (state.currentEditingId === action.payload) {
        state.currentEditingId = null;
        state.bookingData = initialState.bookingData;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
        state.bookingData = initialState.bookingData;
        state.currentEditingId = null;
      })
      .addCase(submitBooking.rejected, (state, action) => {
        // Handle error state if needed
        console.error('Failed to submit booking:', action.error);
      });
  },
});

export const {
  updateBookingField,
  addBooking,
  resetBookingForm,
  setEditingBooking,
  deleteBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;

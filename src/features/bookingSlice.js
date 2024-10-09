import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';

export const submitBooking = createAsyncThunk(
  'booking/submitBooking',
  async (_, { getState }) => {
    const { bookingData } = getState().booking;
    const docRef = await addDoc(collection(db, 'bookings'), bookingData);
    return { ...bookingData, id: docRef.id };
  }
);

export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async (_, { dispatch }) => {
    const unsubscribe = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      const bookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setBookings(bookings));
    });
    return unsubscribe;
  }
);

export const deleteBookingFromFirestore = createAsyncThunk(
  'booking/deleteBookingFromFirestore',
  async (bookingId, { dispatch }) => {
    await deleteDoc(doc(db, 'bookings', bookingId));
    dispatch(deleteBooking(bookingId));
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
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
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
    setBookings(state, action) {
      state.bookings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookings.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        console.error('Failed to fetch bookings:', action.error);
      })
      .addCase(submitBooking.fulfilled, (state, action) => {
        state.bookingData = initialState.bookingData;
        state.currentEditingId = null;
        state.status = 'succeeded';
      })
      .addCase(submitBooking.rejected, (state, action) => {
        state.status = 'failed';
        console.error('Failed to submit booking:', action.error);
      });
  },
});

export const {
  updateBookingField,
  addBooking,
  setEditingBooking,
  resetBookingForm,
  deleteBooking,
  setBookings,
} = bookingSlice.actions;

export default bookingSlice.reducer;

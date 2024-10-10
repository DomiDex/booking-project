import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setEditingBooking,
  deleteBookingFromFirestore,
  fetchBookings,
} from '../features/bookingSlice';

export default function BookingCard() {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.booking.bookings);
  const status = useSelector((state) => state.booking.status);

  useEffect(() => {
    const unsubscribePromise = dispatch(fetchBookings());
    return () => {
      unsubscribePromise.then((unsubscribe) => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    };
  }, [dispatch]);

  const handleEdit = (id) => {
    dispatch(setEditingBooking(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteBookingFromFirestore(id));
  };

  if (status === 'loading') {
    return <div>Loading bookings...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading bookings. Please try again.</div>;
  }

  return (
    <div className='container mx-auto px-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className='relative flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md'
          >
            <div className='p-6'>
              <h2 className='text-xl text-blue-600 font-semibold mb-2'>
                {booking.name}
              </h2>
              <p className='mb-4 text-sm'>{booking.description}</p>
              <p className='mb-2 text-sm'>
                <strong className='text-blue-600'>Date:</strong> {booking.date}
              </p>
              <p className='mb-2 text-sm'>
                <strong className='text-blue-600'>Time:</strong> {booking.time}
              </p>
              <p className='mb-2 text-sm'>
                <strong className='text-blue-600'>Email:</strong>{' '}
                {booking.email}
              </p>
              <p className='mb-2 text-sm'>
                <strong className='text-blue-600'>Phone:</strong>{' '}
                {booking.phone}
              </p>
              <div className='flex flex-row items-center gap-4 mt-4'>
                <button
                  className='bg-green-500 text-white px-4 py-1 rounded-md'
                  onClick={() => handleEdit(booking.id)}
                >
                  Edit
                </button>
                <button
                  className='bg-red-500 text-white px-4 py-1 rounded-md'
                  onClick={() => handleDelete(booking.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

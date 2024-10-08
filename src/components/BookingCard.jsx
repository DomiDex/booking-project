import { useDispatch, useSelector } from 'react-redux';
import { setEditingBooking, deleteBooking } from '../features/bookingSlice';

export default function BookingCard() {
  const bookings = useSelector((state) => state.booking.bookings);
  const dispatch = useDispatch();

  const handleEdit = (id) => {
    dispatch(setEditingBooking(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteBooking(id));
  };

  return (
    <div>
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className='relative mt-6 flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md'
        >
          <div className='p-6'>
            <h2 className='text-2xl text-blue-600 font-semibold mb-2'>
              {booking.name}
            </h2>
            <p className='mb-4'>{booking.description}</p>
            <p className='mb-2'>
              <strong className='text-blue-600'>Date:</strong> {booking.date}
            </p>
            <p className='mb-2'>
              <strong className='text-blue-600'>Time:</strong> {booking.time}
            </p>
            <p className='mb-2'>
              <strong className='text-blue-600'>Email:</strong> {booking.email}
            </p>
            <p className='mb-2'>
              <strong className='text-blue-600'>Phone:</strong> {booking.phone}
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
  );
}

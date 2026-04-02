import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets.js';
import Title from '../components/Title.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { User } from 'lucide-react';
import OwnerDetailsModal from '../components/owner/OwnerDetailsModal.jsx';
import { motion } from 'motion/react';

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const { axios, user, currency } = useAppContext();

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('api/v1/bookings/user-bookings');
      if (data.success) {
        setBookings(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const cancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking? This action cannot be undone.',
    );
    if (!confirmed) return;

    try {
      const { data } = await axios.post('api/v1/bookings/cancel', { bookingId });
      if (data.success) {
        toast.success('Booking cancelled successfully');
        fetchMyBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to cancel booking');
    }
  };

  useEffect(() => {
    user && fetchMyBookings();
  }, [user]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm"
      >
        <Title title="My Bookings" subTitle="View and manage your all car booking" align="left" />

        <div className="max-w-7xl">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6
                border border-borderColor rounded-lg mt-5 first:mt-12 hover:shadow-lg transition-shadow"
            >
              {/* Car Image and Info */}
              <div className="md:col-span-1">
                <div
                  className="rounded-md overflow-hidden mb-3 bg-gray-100 cursor-pointer group relative"
                  onClick={() => setSelectedOwner(booking.owner)}
                >
                  <img
                    src={
                      booking.car.image?.url ||
                      booking.car.images?.[0]?.url ||
                      assets.car_placeholder
                    }
                    alt={`${booking.car.brand} ${booking.car.model}`}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-xs bg-black/70 px-3 py-1.5 rounded-full flex items-center gap-1">
                      <User size={12} />
                      View Owner
                    </div>
                  </div>
                </div>
                <p className="text-lg font-medium mt-2">
                  {booking.car.brand} {booking.car.model}
                </p>
                <p className="text-gray-500 text-sm">
                  {booking.car.year} • {booking.car.category} • {booking.car.location}
                </p>
              </div>

              {/* Booking Info */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="px-3 py-1.5 bg-light rounded text-sm">Booking #{index + 1}</p>
                  <p
                    className={`px-3 py-1 text-xs rounded-full ${
                      booking.status === 'Confirmed'
                        ? 'bg-green-400/15 text-green-600'
                        : 'bg-red-400/15 text-red-600'
                    }`}
                  >
                    {booking.status}
                  </p>
                </div>

                <div className="flex items-start gap-2 mt-3">
                  <img src={assets.calendar_icon_colored} alt="" className="w-4 h-4 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Rental Period</p>
                    <p className="font-medium">
                      {new Date(booking.pickupDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      →{' '}
                      {new Date(booking.returnDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 mt-3">
                  <img src={assets.location_icon} alt="" className="w-4 h-4 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Pickup Location</p>
                    <p className="font-medium">{booking.car.location}</p>
                  </div>
                </div>
              </div>

              {/* Price & Cancel */}
              <div className="md:col-span-1 flex flex-col justify-between gap-6">
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Total Price</p>
                  <h1 className="text-2xl font-semibold text-primary">
                    {currency}
                    {booking.price.toLocaleString()}
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Booked on{' '}
                    {new Date(booking.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {booking.status === 'Confirmed' && new Date(booking.pickupDate) > new Date() && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => cancelBooking(booking._id)}
                    className="text-red-500 text-sm hover:text-red-600 transition-colors text-right cursor-pointer"
                  >
                    Cancel Booking
                  </motion.button>
                )}
                                
              </div>
            </motion.div>
          ))}

          {bookings.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16 text-gray-400 mt-12"
            >
              <p className="text-6xl mb-4">🚗</p>
              <p className="font-medium">No bookings found</p>
              <p className="text-xs mt-1">You haven't made any car bookings yet</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <OwnerDetailsModal selectedOwner={selectedOwner} onClose={() => setSelectedOwner(null)} />
    </>
  );
};

export default MyBooking;

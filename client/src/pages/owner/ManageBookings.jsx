import React, { useEffect, useState } from 'react';
import Title from '../../components/owner/Title.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import CustomerDetailsModal from '../../components/CustomerDetailsModal.jsx';

const ManageBookings = () => {
  const { currency, axios } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get('/api/v1/bookings/owner-bookings');
      data.success ? setBookings(data.data) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/v1/bookings/change-status', { bookingId, status });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  const filteredBookings = bookings?.filter((b) => b.car);

  return (
    <div className="px-4 pt-6 pb-6 md:px-10 md:pt-8 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests and manage booking statuses."
      />

      <div className="w-full rounded-md overflow-hidden border border-borderColor mt-5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-600 min-w-[320px]">
            <thead className="text-gray-500 bg-gray-50">
              <tr>
                <th className="p-3 font-medium">Car</th>
                <th className="p-3 font-medium hidden sm:table-cell">Date Range</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium hidden md:table-cell">Payment</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking, index) => (
                <tr
                  key={index}
                  className="border-t border-borderColor text-gray-500 hover:bg-gray-50 transition"
                >
                  {/* Car click image to see customer */}
                  <td className="p-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={booking.car.image?.url}
                        alt=""
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-md object-cover cursor-pointer hover:opacity-80 flex-shrink-0"
                        onClick={() =>
                          setSelectedUser({
                            ...booking.user,
                            pickupDate: booking.pickupDate,
                            returnDate: booking.returnDate,
                          })
                        }
                        title="View customer details"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-xs sm:text-sm line-clamp-1">
                          {booking.car?.brand} {booking.car?.model}
                        </p>
                        {/* Date  mobile only under car name */}
                        <p className="text-xs text-gray-400 sm:hidden">
                          {booking.pickupDate.split('T')[0]} → {booking.returnDate.split('T')[0]}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Date Range  */}
                  <td className="p-3 hidden sm:table-cell text-xs sm:text-sm whitespace-nowrap">
                    {booking.pickupDate.split('T')[0]} → {booking.returnDate.split('T')[0]}
                  </td>

                  {/* Price */}
                  <td className="p-3 text-sm whitespace-nowrap">
                    {currency} {booking.price || 0}
                  </td>

                  {/* Payment  */}
                  <td className="p-3 hidden md:table-cell">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">offline</span>
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    {booking.status.toLowerCase() === 'pending' ? (
                      <select
                        value={booking.status}
                        onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                        className="px-2 py-1.5 border border-borderColor rounded-md text-xs sm:text-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Confirmed">Confirmed</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                        ${
                          booking.status.toLowerCase() === 'confirmed'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-500'
                        }`}
                      >
                        {booking.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 sm:py-16 text-gray-400">
            <p className="text-3xl mb-2">📋</p>
            <p className="font-medium text-sm">No bookings yet</p>
            <p className="text-xs mt-1">Customer bookings will appear here</p>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
    <CustomerDetailsModal
  selectedUser={selectedUser}
  onClose={() => setSelectedUser(null)}
/>
    </div> 
  );
};

export default ManageBookings;

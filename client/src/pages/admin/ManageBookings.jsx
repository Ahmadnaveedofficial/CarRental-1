import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/api/v1/admin/bookings');
      if (data?.success) setBookings(data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-6">Manage Bookings</h2>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Car</th>
              <th className="px-6 py-3 text-left">Pickup</th>
              <th className="px-6 py-3 text-left">Return</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-6 text-gray-400">No bookings found</td></tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-700">{booking?.user?.name || '—'}</td>
                  <td className="px-6 py-3 text-gray-500">{booking?.car?.name || '—'}</td>
                  <td className="px-6 py-3 text-gray-500">{booking.pickupDate?.slice(0, 10)}</td>
                  <td className="px-6 py-3 text-gray-500">{booking.returnDate?.slice(0, 10)}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                        booking.status === 'Cancelled' ? 'bg-red-100 text-red-500' :
                        'bg-yellow-100 text-yellow-600'}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
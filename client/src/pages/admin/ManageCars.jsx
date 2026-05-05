import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/api/v1/admin/cars');
      if (data?.success) setCars(data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id) => {
    if (!window.confirm('Delete this car?')) return;
    try {
      const { data } = await axios.delete(`/api/v1/admin/cars/${id}`);
      if (data?.success) {
        toast.success('Car deleted successfully');
        setCars((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => { fetchCars(); }, []);

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-6">Manage Cars</h2>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Owner</th>
              <th className="px-6 py-3 text-left">Price/Day</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cars.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-6 text-gray-400">No cars found</td></tr>
            ) : (
              cars.map((car) => (
                <tr key={car._id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <img
                      src={car?.image?.url || '/car.png'}
                      className="w-12 h-9 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-700">{car.name}</td>
                  <td className="px-6 py-3 text-gray-500">{car?.owner?.name || '—'}</td>
                  <td className="px-6 py-3 text-gray-500">{car.pricePerDay}/day</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${car.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                      {car.isAvailable ? 'Available' : 'Booked'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => deleteCar(car._id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
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

export default ManageCars;
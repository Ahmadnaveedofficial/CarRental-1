import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets.js';
import Title from '../../components/owner/Title.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import EditCar from '../../components/owner/EditCar.jsx';

const ManageCar = () => {
  const { isOwner, axios, currency } = useAppContext();
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const navigate = useNavigate();

  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get('/api/v1/owners/cars');
      if (data.success) setCars(data.data);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post('/api/v1/owners/toggle-car', { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    try {
      const { data } = await axios.post('/api/v1/owners/delete-car', { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isOwner && fetchOwnerCars();
  }, [isOwner]);

  return (
    <div className="px-4 pt-6 pb-6 md:px-10 md:pt-8 w-full">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform."
      />

      <div className="flex justify-end mt-4 mb-3">
        <button
          onClick={() => navigate('/owner/add-car')}
          className="cursor-pointer px-4 py-2 bg-primary hover:bg-primary-dull text-white text-sm rounded-md transition-all"
        >
          + Add Car
        </button>
      </div>

      <div className="w-full rounded-md overflow-hidden border border-borderColor">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-600 min-w-[320px]">
            <thead className="text-gray-500 bg-gray-50">
              <tr>
                <th className="p-3 font-medium">Car</th>
                <th className="p-3 font-medium hidden sm:table-cell">Category</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium hidden md:table-cell">Status</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car, index) => (
                <tr key={index} className="border-t border-borderColor hover:bg-gray-50 transition">
                  {/* Car Info */}
                  <td className="p-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={car.images?.[0]?.url || car.image?.url}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-md object-cover flex-shrink-0"
                        alt=""
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-xs sm:text-sm line-clamp-1">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-xs text-gray-400 hidden sm:block">
                          {car.seating_capacity} Seats • {car.transmission}
                        </p>
                        {/* Category on mobile */}
                        <p className="text-xs text-gray-400 sm:hidden">{car.category}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-3 hidden sm:table-cell text-sm">{car.category}</td>

                  {/* Price */}
                  <td className="p-3 text-sm whitespace-nowrap">
                    {currency} {car.pricePerDay}/day
                  </td>

                  {/* Status*/}
                  <td className="p-3 hidden md:table-cell">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                      ${car.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}
                    >
                      {car.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        onClick={() => toggleAvailability(car._id)}
                        src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon}
                        className="cursor-pointer w-10 h-10 opacity-70 hover:opacity-100 transition"
                        alt="toggle"
                        title={car.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                      />
                      <img
                        onClick={() => setEditingCar(car)}
                        src={assets.edit_button}
                        className="cursor-pointer h-4 opacity-70 hover:opacity-100 transition"
                        alt="edit"
                        title="Edit Car"
                      />
                      <img
                        onClick={() => deleteCar(car._id)}
                        src={assets.delete_icon}
                        className="cursor-pointer w-10 h-10 opacity-70 hover:opacity-100 transition"
                        alt="delete"
                        title="Delete Car"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cars.length === 0 && (
          <div className="text-center py-12 sm:py-16 text-gray-400">
            <p className="text-3xl mb-2">🚗</p>
            <p className="font-medium text-sm">No cars listed yet</p>
            <p className="text-xs mt-1">Click "Add Car" to list your first car</p>
          </div>
        )}
      </div>

      {editingCar && (
        <EditCar
          car={editingCar}
          axios={axios}
          currency={currency}
          onClose={() => setEditingCar(null)}
          onSaved={() => {
            setEditingCar(null);
            fetchOwnerCars();
          }}
        />
      )}
    </div>
  );
};

export default ManageCar;

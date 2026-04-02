import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import Loader from '../components/Loader.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { Calendar } from 'lucide-react';
import { motion } from 'motion/react';

const CarDetails = () => {
  const { axios, cars, returnDate, pickupDate, setPickupDate, setReturnDate } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const currency = import.meta.env.VITE_CURRENCY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/v1/bookings/create', {
        car: id,
        pickupDate,
        returnDate,
      });
      if (data.success) {
        toast.success(data.message);
        navigate('/my-bookings');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    setCar(cars.find((car) => car._id === id));
    setActiveImage(0);
  }, [cars, id]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const { data } = await axios.get(`/api/v1/users/cars/${id}/booked-dates`);
        if (data.success) setBookedDates(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (id) fetchBookedDates();
  }, [id]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const gallery = car
    ? car.images?.length > 0
      ? car.images
      : car.image?.url
        ? [{ url: car.image.url }]
        : []
    : [];

  return car ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16"
    >
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
        Back to all cars
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* LEFT */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            {/* Main Image */}
            <div className="rounded-xl overflow-hidden shadow-md mb-3 h-72 md:h-96">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={gallery[activeImage]?.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {gallery.map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImage(index)}
                    className={`h-16 w-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all
                      ${
                        activeImage === index
                          ? 'border-primary opacity-100'
                          : 'border-transparent opacity-60 hover:opacity-90'
                      }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <div className="space-y-6">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h1 className="text-3xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-lg">
                {car.category} • {car.year}
              </p>
            </motion.div>

            <hr className="border-borderColor" />

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }, index) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + index * 0.07 }}
                  className="flex flex-col items-center bg-light p-4 rounded-lg"
                >
                  <img src={icon} alt="" className="h-4 mb-2" />
                  {text}
                </motion.div>
              ))}
            </div>

            {/* Owner Info */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <h1 className="text-xl font-medium mb-3">Listed By</h1>
              <div className="flex items-center gap-4 p-4 border border-borderColor rounded-xl bg-light">
                {car.owner?.image?.url ? (
                  <img
                    src={car.owner.image.url}
                    alt={car.owner.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {car.owner?.name?.charAt(0) || 'A'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800">{car.owner?.name}</p>
                  <p className="text-xs text-gray-400">{car.owner?.email}</p>
                </div>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h1 className="text-xl font-medium mb-3">Features</h1>
              {car.features?.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {car.features.map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
                      className="flex items-center text-gray-500"
                    >
                      <img src={assets.check_icon} className="h-4 mr-2" alt="" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No features listed</p>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <h1 className="text-xl font-medium mb-3">Description</h1>
              <p className="text-gray-500">{car.description}</p>
            </motion.div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6">
          {/* Booking Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="shadow-lg rounded-xl p-6 space-y-6 text-gray-500"
          >
            <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">
              {currency}
              {car.pricePerDay}
              <span className="text-base text-gray-400 font-normal">Per Day</span>
            </p>
            <hr className="border-borderColor" />
            <div className="flex flex-col gap-3">
              <label htmlFor="pickup-date">Pickup Date</label>
              <input
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                type="date"
                className="border border-borderColor px-3 py-2 rounded-lg cursor-pointer"
                required
                id="pickup-date"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="return-date">Return Date</label>
              <input
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                type="date"
                className="border border-borderColor px-3 py-2 rounded-lg cursor-pointer"
                required
                id="return-date"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer"
            >
              Book Now
            </motion.button>
            <p className="text-center text-sm">No credit card required to reserve</p>
          </motion.form>

          {/* Booked Dates */}
          {bookedDates.filter((b) => new Date(b.returnDate) >= new Date()).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="border border-borderColor rounded-xl p-5 shadow-sm"
            >
              <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                Booked Dates
              </h2>
              <div className="space-y-3">
                {bookedDates
                  .filter((booking) => new Date(booking.returnDate) >= new Date())
                  .map((booking, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.06 }}
                      className="flex items-center justify-between bg-red-50 border border-red-100 rounded-lg px-4 py-2.5"
                    >
                      <div className="text-sm text-red-500 font-medium">
                        {formatDate(booking.pickupDate)}
                      </div>
                      <div className="text-xs text-red-300 px-2">→</div>
                      <div className="text-sm text-red-500 font-medium">
                        {formatDate(booking.returnDate)}
                      </div>
                    </motion.div>
                  ))}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                These dates are already booked
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  ) : (
    <Loader />
  );
};

export default CarDetails;

import React, { useEffect, useState } from 'react';
import Title from '../components/Title.jsx';
import { assets } from '../assets/assets.js';
import CarCard from '../components/CarCard.jsx';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

const Cars = () => {
  const [input, setInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get('pickupLocation');
  const pickupDate = searchParams.get('pickupDate');
  const returnDate = searchParams.get('returnDate');

  const { cars, axios } = useAppContext();

  const isSearchData = pickupLocation && pickupDate && returnDate;
  const [filteredCars, setFilteredCars] = useState([]);

  const categories = [
    'All', 'Sedan', 'SUV', 'Hatchback', 'Luxury', 'Sports',
    'Van', 'Coupe', 'Convertible', 'Pickup Truck', 'Crossover',
    'Minivan', 'Wagon', 'Electric',
  ];

  const applyFilter = () => {
    let filtered = [...cars];
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((car) => car.category === selectedCategory);
    }
    if (input.trim() !== '') {
      filtered = filtered.filter((car) => {
        return (
          car.brand?.toLowerCase().includes(input.toLowerCase()) ||
          car.model?.toLowerCase().includes(input.toLowerCase()) ||
          car.category?.toLowerCase().includes(input.toLowerCase()) ||
          car.transmission?.toLowerCase().includes(input.toLowerCase())
        );
      });
    }
    setFilteredCars(filtered);
    if (filtered.length === 0 && input.trim() !== '') {
      toast('No cars found matching your search');
    }
  };

  const searchCarAvailablity = async () => {
    try {
      const { data } = await axios.post('/api/v1/bookings/check-availability', {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });
      if (data.success) {
        const carsData = data.data || [];
        setFilteredCars(carsData);
        if (carsData.length === 0) toast('No cars available');
        return null;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (isSearchData) searchCarAvailablity();
  }, [isSearchData, pickupLocation, pickupDate, returnDate]);

  useEffect(() => {
    if (cars.length > 0 && !isSearchData) applyFilter();
  }, [input, selectedCategory, cars]);

  return (
    <div>
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center bg-white px-4 mt-4 max-w-140 w-full h-12 rounded-full shadow"
        >
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by brand, model, category, or transmission"
            className="w-full h-full outline-none text-gray-500"
          />
          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5 ml-2" />
        </motion.div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">

        {/* Category Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-6 xl:px-20 max-w-7xl mx-auto"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                ${selectedCategory === category
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-gray-500 xl:px-20 max-w-7xl mx-auto"
        >
          Showing {filteredCars.length} {filteredCars.length === 1 ? 'Car' : 'Cars'}
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {filteredCars.map((car, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>

        {filteredCars.length === 0 && !isSearchData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-20 text-gray-400 xl:px-20 max-w-7xl mx-auto"
          >
            <p className="text-5xl mb-4">🚗</p>
            <p className="text-lg font-medium">No cars found</p>
            <p className="text-sm mt-1">
              {input || selectedCategory !== 'All'
                ? 'Try adjusting your search or category filter'
                : 'Check back soon for new vehicles'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cars;
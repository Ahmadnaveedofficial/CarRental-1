import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Fuel, Settings, MapPin, ArrowRight } from 'lucide-react';

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/car-details/${car._id}`);
        scrollTo(0, 0);
      }}
      className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group"
    >
      {/* Image */}
      <div className="overflow-hidden h-52 relative">
        <img
          src={car.image?.url}
          alt={car.brand + ' ' + car.model}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {car.isAvailable && (
          <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 bg-primary/90 text-white rounded-full">
            Available Now
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category and Year */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">
            {car.category}
          </span>
          <span className="text-xs text-gray-400">{car.year}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-800 text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
          {car.brand} {car.model}
        </h3>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users size={12} /> {car.seating_capacity} Seats
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Fuel size={12} /> {car.fuel_type}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Settings size={12} /> {car.transmission}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={12} /> {car.location}
          </div>
        </div>

        {/* Price and Arrow */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-gray-800 font-bold text-base">
            {currency}
            {car.pricePerDay}
            <span className="text-xs font-normal text-gray-400 ml-1">/ day</span>
          </p>
          <span className="text-primary group-hover:translate-x-1 transition-transform duration-200">
            <ArrowRight size={18} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default CarCard;

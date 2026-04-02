import React, { useState, useRef } from 'react';
import Title from '../../components/owner/Title.jsx';
import { assets } from '../../assets/assets.js';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { X, ImagePlus } from 'lucide-react';

const AddCar = () => {
  const { axios, currency } = useAppContext();
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState([]);
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: '',
  });

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [
      ...prev,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures((prev) => [...prev, trimmed]);
      setFeatureInput('');
    }
  };

  const removeFeature = (feature) => setFeatures((prev) => prev.filter((f) => f !== feature));

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (images.length === 0) return toast.error('Please upload at least one image');

    setIsLoading(true);
    try {
      const formData = new FormData();
      images.forEach(({ file }) => formData.append('images', file));
      formData.append('carData', JSON.stringify({ ...car, features }));

      const { data } = await axios.post('/api/v1/owners/add-car', formData);
      if (data.success) {
        toast.success(data.message);
        images.forEach(({ preview }) => URL.revokeObjectURL(preview));
        setImages([]);
        setFeatures([]);
        setFeatureInput('');
        setCar({ brand: '', model: '', year: 0, pricePerDay: 0, category: '', transmission: '', fuel_type: '', seating_capacity: 0, location: '', description: '' });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 md:px-10 md:py-10 flex-1">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, availability, and specifications."
      />

      <form
        onSubmit={onSubmitHandle}
        className="flex flex-col gap-4 sm:gap-5 text-gray-500 text-sm mt-5 w-full max-w-xl"
      >
        {/* Images */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-600">Car Images</label>

          {images.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden h-20 sm:h-24 border border-borderColor"
                >
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      Cover
                    </span>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="h-20 sm:h-24 border-2 border-dashed border-borderColor rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-primary hover:text-primary transition cursor-pointer"
              >
                <ImagePlus size={20} />
                <span className="text-xs">Add more</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-borderColor rounded-xl py-8 text-gray-400 hover:border-primary hover:text-primary transition cursor-pointer"
            >
              <ImagePlus size={28} />
              <span className="text-sm">Click to upload images</span>
              <span className="text-xs text-gray-300">PNG, JPG, WEBP — max 10 images</span>
            </button>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleImageSelect} />
        </div>

        {/* Brand & Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 mb-1">Brand *</label>
            <input
              type="text"
              placeholder="BMW, Audi, Honda..."
              required
              className="px-3 py-2 border border-borderColor rounded-md outline-none focus:border-primary text-sm"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 mb-1">Model *</label>
            <input
              type="text"
              placeholder="e.g X5, AClass, M3..."
              required
              className="px-3 py-2 border border-borderColor rounded-md outline-none focus:border-primary text-sm"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
            />
          </div>
        </div>

        {/* Year, Price, Category */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 mb-1">Year *</label>
            <input
              type="number"
              placeholder="2026"
              required
              className="px-3 py-2 border border-borderColor rounded-md outline-none focus:border-primary text-sm"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 mb-1">Price ({currency}) *</label>
            <input
              type="number"
              placeholder="10000"
              required
              className="px-3 py-2 border border-borderColor rounded-md outline-none focus:border-primary text-sm"
              value={car.pricePerDay}
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
            />
          </div>
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <label className="font-medium text-gray-600 mb-1">Category *</label>
            <select
              required
              value={car.category}
              onChange={(e) => setCar({ ...car, category: e.target.value })}
              className="px-3 py-2 border border-borderColor rounded-md outline-none focus:border-primary text-sm"
            >
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Luxury">Luxury</option>
              <option value="Sports">Sports</option>
              <option value="Van">Van</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
              <option value="Pickup Truck">Pickup Truck</option>
              <option value="Crossover">Crossover</option>
              <option value="Minivan">Minivan</option>
              <option value="Wagon">Wagon</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
        </div>

        {/* Transmission, Fuel, Seating */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 mb-1">Transmission *</label>
            <select
              required
              value={car.transmission}
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
              className="px-3 py-2 border border-borderColor rounded-md outline-none focus:border-primary text-sm"
            >
              <option value="">Select</option>
              <option value="Automatic">Automatic</option>
              <option value="Semi-Automatic">Semi-Auto</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 mb-1">Fuel Type *</label>
            <select
              required
              value={car.fuel_type}
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
              className="px-3 py-2 border border-borderColor rounded-md outline-none focus:border-primary text-sm"
            >
              <option value="">Select</option>
              <option value="Petrol">Petrol</option>
              <option value="Gas">Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <label className="font-medium text-gray-600 mb-1">Seats *</label>
            <input
              type="number"
              placeholder="4"
              required
              className="px-3 py-2 border border-borderColor rounded-md outline-none focus:border-primary text-sm"
              value={car.seating_capacity}
              onChange={(e) => setCar({ ...car, seating_capacity: e.target.value })}
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-600 mb-1">Location *</label>
          <input
            type="text"
            placeholder="e.g. Lahore, Karachi, Islamabad..."
            required
            className="px-3 py-2 border border-borderColor rounded-md outline-none focus:border-primary text-sm"
            value={car.location}
            onChange={(e) => setCar({ ...car, location: e.target.value })}
          />
        </div>

        {/* Features */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-600 mb-1">Features</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              placeholder="e.g. GPS, Sunroof, Bluetooth..."
              className="px-3 py-2 border border-borderColor rounded-md outline-none flex-1 focus:border-primary text-sm"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-3 sm:px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dull cursor-pointer text-sm"
            >
              Add
            </button>
          </div>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {features.map((feature) => (
                <span
                  key={feature}
                  className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full"
                >
                  {feature}
                  <button type="button" onClick={() => removeFeature(feature)} className="hover:text-red-500 font-bold ml-1 cursor-pointer">✕</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-600 mb-1">Description *</label>
          <textarea
            rows={4}
            placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine."
            required
            className="px-3 py-2 border border-borderColor rounded-md outline-none resize-none focus:border-primary text-sm"
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-md font-medium w-max cursor-pointer hover:bg-primary-dull transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <img src={assets.tick_icon} alt="" className="w-4 h-4" />
          {isLoading ? 'Listing...' : 'List Your Car'}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
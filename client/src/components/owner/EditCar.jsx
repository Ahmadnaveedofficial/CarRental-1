import React, { useEffect, useRef, useState } from 'react';
import { X, ImagePlus } from 'lucide-react';
import { assets } from '../../assets/assets.js';
import toast from 'react-hot-toast';

const EditCar = ({ car, onClose, onSaved, axios, currency }) => {
  const fileInputRef = useRef(null);

  const [existingImages, setExistingImages] = useState(() => {
    if (car.images?.length > 0) return car.images;
    if (car.image?.url) return [{ public_id: car.image.public_id, url: car.image.url }];
    return [];
  });

  const [newImages, setNewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState(car.features || []);
  const [form, setForm] = useState({
    brand: car.brand || '',
    model: car.model || '',
    year: car.year || '',
    pricePerDay: car.pricePerDay || '',
    category: car.category || '',
    transmission: car.transmission || '',
    fuel_type: car.fuel_type || '',
    seating_capacity: car.seating_capacity || '',
    location: car.location || '',
    description: car.description || '',
  });

  const totalImages = existingImages.length + newImages.length;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      newImages.forEach(({ preview }) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [newImages]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [
      ...prev,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
    e.target.value = '';
  };

  const removeExisting = (index) =>
    setExistingImages((prev) => prev.filter((_, i) => i !== index));

  const removeNew = (index) => {
    setNewImages((prev) => {
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

  const removeFeature = (feature) =>
    setFeatures((prev) => prev.filter((f) => f !== feature));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (totalImages === 0) return toast.error('At least one image is required');

    setIsLoading(true);
    try {
      const formData = new FormData();
      newImages.forEach(({ file }) => formData.append('images', file));
      formData.append('existingImages', JSON.stringify(existingImages));
      formData.append('carData', JSON.stringify({ ...form, features }));

      const { data } = await axios.patch(`/api/v1/owners/edit-car/${car._id}`, formData);
      if (data.success) {
        toast.success(data.message);
        onSaved();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      {/* Modal Box  slides up from bottom on mobile, centered on desktop */}
      <div
        className="bg-white w-full sm:rounded-2xl sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl rounded-t-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">Edit Car</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer transition p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 sm:gap-5 px-4 sm:px-6 py-4 sm:py-5 text-sm text-gray-500"
        >
          {/* Images */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-600">
              Images <span className="text-xs text-gray-400">(First image will be cover)</span>
            </label>

            {totalImages > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {existingImages.map((img, i) => (
                  <div
                    key={`ex-${i}`}
                    className="relative group rounded-lg overflow-hidden h-20 border border-gray-200"
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExisting(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full">
                        Cover
                      </span>
                    )}
                  </div>
                ))}

                {newImages.map((img, i) => (
                  <div
                    key={`new-${i}`}
                    className="relative group rounded-lg overflow-hidden h-20 border border-gray-200"
                  >
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNew(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                    {existingImages.length === 0 && i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full">
                        Cover
                      </span>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="h-20 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-primary hover:text-primary transition cursor-pointer"
                >
                  <ImagePlus size={18} />
                  <span className="text-[11px]">Add</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-6 text-gray-400 hover:border-primary hover:text-primary transition cursor-pointer"
              >
                <ImagePlus size={24} />
                <span className="text-xs">Click to upload images</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageSelect}
            />
          </div>

          {/* Brand and Model */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col">
              <label className="font-medium text-gray-600 mb-1">Brand *</label>
              <input
                type="text"
                required
                placeholder="BMW, Audi, Honda..."
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-primary text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-600 mb-1">Model *</label>
              <input
                type="text"
                required
                placeholder="X5, AClass, M3..."
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-primary text-sm"
              />
            </div>
          </div>

          {/* Year, Price, Category  2 cols on mobile, 3 on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex flex-col">
              <label className="font-medium text-gray-600 mb-1">Year *</label>
              <input
                type="number"
                required
                placeholder="2024"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-primary text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-600 mb-1">Price ({currency}) *</label>
              <input
                type="number"
                required
                placeholder="10000"
                value={form.pricePerDay}
                onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-primary text-sm"
              />
            </div>
            <div className="flex flex-col col-span-2 sm:col-span-1">
              <label className="font-medium text-gray-600 mb-1">Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-primary text-sm"
              >
                <option value="">Select</option>
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

          {/* Transmission, Fuel, Seating 2 cols on mobile, 3 on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex flex-col">
              <label className="font-medium text-gray-600 mb-1">Transmission *</label>
              <select
                required
                value={form.transmission}
                onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-primary text-sm"
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
                value={form.fuel_type}
                onChange={(e) => setForm({ ...form, fuel_type: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-primary text-sm"
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
                required
                placeholder="4"
                value={form.seating_capacity}
                onChange={(e) => setForm({ ...form, seating_capacity: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-primary text-sm"
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 mb-1">Location *</label>
            <input
              type="text"
              required
              placeholder="e.g. Lahore, Karachi, Islamabad..."
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-primary text-sm"
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
                placeholder="e.g. GPS, Sunroof..."
                className="px-3 py-2 border border-gray-200 rounded-md outline-none flex-1 focus:border-primary text-sm"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-3 sm:px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dull transition cursor-pointer text-sm"
              >
                Add
              </button>
            </div>
            {features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {features.map((feature) => (
                  <span
                    key={feature}
                    className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="hover:text-red-500 font-bold ml-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 mb-1">Description *</label>
            <textarea
              rows={3}
              required
              placeholder="e.g. A luxurious SUV with a spacious interior..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-md outline-none resize-none focus:border-primary text-sm"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100 mt-1 pb-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-primary text-white rounded-md font-medium hover:bg-primary-dull transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <img src={assets.tick_icon} alt="save" className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-5 py-2.5 border border-gray-200 text-gray-500 rounded-md hover:bg-gray-50 transition cursor-pointer text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCar;
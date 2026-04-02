import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets.js';
import Title from '../../components/owner/Title.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext();
  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyEarnings: 0,
  });

  const fetchDashBoardData = async () => {
    try {
      const { data } = await axios.get('/api/v1/owners/dashboard');
      if (data.success) {
        setData(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const dashboardCards = [
    { title: 'Total Cars', value: data.totalCars, icon: assets.carIconColored },
    { title: 'Total Bookings', value: data.totalBookings, icon: assets.listIconColored },
    { title: 'Pending', value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: 'Completed', value: data.completedBookings, icon: assets.listIconColored },
  ];

  useEffect(() => {
    if (isOwner) fetchDashBoardData();
  }, [isOwner]);

  return (
    <div className="px-4 py-6 md:px-10 md:py-10 flex-1">
      <Title
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 my-6 md:my-8">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2 p-3 sm:p-4 rounded-md border border-borderColor"
          >
            <div>
              <p className="text-xs text-gray-500">{card.title}</p>
              <p className="text-xl sm:text-2xl font-semibold mt-0.5">{card.value}</p>
            </div>
            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex-shrink-0">
              {card.icon && <img src={card.icon} alt="" className="w-4 h-4" />}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col lg:flex-row items-start gap-4 md:gap-6 mb-8 w-full">
        {/* Recent Bookings */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md w-full lg:max-w-lg">
          <h2 className="text-base sm:text-lg font-medium">Recent Bookings</h2>
          <p className="text-gray-500 text-sm">Latest customer bookings</p>

          {data.recentBookings.filter((b) => b.car).length === 0 && (
            <p className="text-gray-400 text-sm mt-4">No recent bookings yet.</p>
          )}

          {data.recentBookings
            .filter((booking) => booking.car)
            .map((booking, index) => (
              <div className="mt-4 flex items-center justify-between gap-2" key={index}>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                    <img src={assets.listIconColored} alt="" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {booking.car.brand} {booking.car.model}
                    </p>
                    <p className="text-xs text-gray-500">{booking.createdAt.split('T')[0]}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <p className="text-sm text-gray-500 hidden sm:block">
                    {currency} {booking.price}
                  </p>
                  <span
                    className={`px-2 py-0.5 border border-borderColor rounded-full text-xs whitespace-nowrap
                    ${
                      booking.status === 'Confirmed'
                        ? 'bg-green-50 text-green-600 border-green-200'
                        : booking.status === 'Cancelled'
                          ? 'bg-red-50 text-red-500 border-red-200'
                          : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Monthly Revenue */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md w-full lg:max-w-xs">
          <h2 className="text-base sm:text-lg font-medium">Monthly Revenue</h2>
          <p className="text-gray-500 text-sm">Revenue for current month</p>
          <p className="text-2xl sm:text-3xl mt-4 sm:mt-6 font-semibold text-primary">
            {currency} {data.monthlyEarnings}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

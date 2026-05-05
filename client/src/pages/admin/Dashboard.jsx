import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/v1/admin/dashboard');
      if (data?.success) setStats(data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats?.totalUsers} icon="👤" color="border-blue-500" />
        <StatCard title="Total Owners" value={stats?.totalOwners} icon="🧑‍💼" color="border-green-500" />
        <StatCard title="Total Cars" value={stats?.totalCars} icon="🚗" color="border-yellow-500" />
        <StatCard title="Total Bookings" value={stats?.totalBookings} icon="📋" color="border-purple-500" />
      </div>
    </div>
  );
};

export default Dashboard;
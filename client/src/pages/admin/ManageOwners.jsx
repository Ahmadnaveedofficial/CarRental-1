import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ManageOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwners = async () => {
    try {
      const { data } = await axios.get('/api/v1/admin/owners');
      if (data?.success) setOwners(data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteOwner = async (id) => {
    if (!window.confirm('Delete owner and all their cars?')) return;
    try {
      const { data } = await axios.delete(`/api/v1/admin/owners/${id}`);
      if (data?.success) {
        toast.success('Owner deleted successfully');
        setOwners((prev) => prev.filter((o) => o._id !== id));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => { fetchOwners(); }, []);

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-6">Manage Owners</h2>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {owners.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-6 text-gray-400">No owners found</td></tr>
            ) : (
              owners.map((owner) => (
                <tr key={owner._id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <img
                      src={owner?.image?.url || '/avatar.png'}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-700">{owner.name}</td>
                  <td className="px-6 py-3 text-gray-500">{owner.email}</td>
                  <td className="px-6 py-3 text-gray-500">{owner.phone || '—'}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => deleteOwner(owner._id)}
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

export default ManageOwners;
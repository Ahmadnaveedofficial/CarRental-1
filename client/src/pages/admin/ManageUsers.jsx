import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/v1/admin/users');
      if (data?.success) setUsers(data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const { data } = await axios.delete(`/api/v1/admin/users/${id}`);
      if (data?.success) {
        toast.success('User deleted successfully');
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-6">Manage Users</h2>
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
            {users.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-6 text-gray-400">No users found</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <img
                      src={user?.image?.url || '/avatar.png'}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-700">{user.name}</td>
                  <td className="px-6 py-3 text-gray-500">{user.email}</td>
                  <td className="px-6 py-3 text-gray-500">{user.phone || '—'}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => deleteUser(user._id)}
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

export default ManageUsers;
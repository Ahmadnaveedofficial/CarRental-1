import { X, Mail, Phone, Car, User } from 'lucide-react';

const CustomerDetailsModal = ({ selectedUser, onClose }) => {
  if (!selectedUser) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:rounded-2xl sm:max-w-md shadow-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b">
          <div className="flex items-center gap-2">
            <User size={18} className="text-primary" />
            <h2 className="text-base sm:text-lg font-bold">Customer Details</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Avatar */}
          <div className="flex items-center gap-3 sm:gap-4 mb-5">
            {selectedUser.image?.url ? (
              <img
                src={selectedUser.image.url}
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-primary flex-shrink-0"
                alt=""
              />
            ) : (
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl sm:text-2xl font-bold flex-shrink-0">
                {selectedUser.name?.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-base sm:text-lg">{selectedUser.name}</h3>
              <p className="text-sm text-gray-500">Customer</p>
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-3">
            {[
              { icon: <Mail size={16} className="text-primary" />, label: 'Email', value: selectedUser.email },
              { icon: <Phone size={16} className="text-primary" />, label: 'Phone', value: selectedUser.phone || 'Not provided' },
              { icon: <Car size={16} className="text-primary" />, label: 'Pickup', value: selectedUser.pickupDate?.split('T')[0] },
              { icon: <Car size={16} className="text-primary" />, label: 'Return', value: selectedUser.returnDate?.split('T')[0] },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="mt-0.5 flex-shrink-0">{icon}</div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm font-medium truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dull transition text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;